import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ArtistService } from '../../artist/artist.service';
import { EventService } from '../../event/event.service';
import { IllegalStateException } from '../../global/exceptions/illegal-state.exception';
import { JwtPayload } from '../../profile/auth/jwt-strategy';
import { BookingDto } from '../model/booking.dto';
import { Booking } from '../model/booking.model';
import { SubmitService } from './submit.service';
import { ProfileService } from '../../profile/profile.service';
import { TelegramService } from '../../telegram/telegram.service';
import { BotUtil } from '../../telegram/util/bot.util';
import { BookingContext, SimpleBookingContext } from '../model/interfaces';
import { MessageException } from '../../global/exceptions/message-exception';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    private readonly submitService: SubmitService,
    private readonly artistService: ArtistService,
    private readonly eventService: EventService,
    private readonly profileService: ProfileService,
    private readonly telegramService: TelegramService,
  ) {}

  public async submitForm(
    formId: string,
    profile: JwtPayload,
    params?: { skipValidateDuplicate: boolean },
  ) {
    const checkFormId = await this.bookingModel.findOne({ formId: formId });
    if (checkFormId) {
      throw new IllegalStateException(
        `Booking for form ${formId} already exists`,
      );
    }
    const ctx = await this.submitService.submitForm(formId, profile, params);

    if (!params?.skipValidateDuplicate) {
      await this.validateBookingDuplicate(ctx.booking);
    }
    this.submitService.msgToManagerAboutSubmitedForm(ctx);

    const saved = await new this.bookingModel(ctx.booking).save();
    return saved;
  }

  private async validateBookingDuplicate(booking: Partial<Booking>) {
    const duplicate = await this.bookingModel.findOne({
      'artists.code': { $in: booking.artists.map((a) => a.code) },
      eventSignature: booking.eventSignature,
    });
    if (duplicate) {
      throw new MessageException(
        `Booking for this event and artist already exists!`,
      );
    }
  }

  public async fetchProfileBookings(
    profile: JwtPayload,
  ): Promise<BookingDto[]> {
    const filter = this.profileBookingFilter(profile);
    const uid = profile.uid;
    const bookings = await this.bookingModel.find(filter).lean().exec();

    const profileBookings = await Promise.all(
      bookings.map((b: Booking) => this.bookingDtoFromBooking(b)),
    );
    this.logger.log(
      `Fetch ${profileBookings.length} profile bookings for ${uid}`,
    );
    return profileBookings;
  }

  private profileBookingFilter(profile: JwtPayload): FilterQuery<Booking> {
    const uid = profile.uid;
    return {
      $or: [
        { promoterUid: uid },
        { managerUid: uid },
        { 'artists.code': profile.artistSignature },
      ],
    };
  }

  public async panelArtistBookings(
    artistSignature: string,
    profile: JwtPayload,
  ) {
    const bookings = await this.bookingModel
      .find({
        'artists.code': artistSignature,
        status: { $nin: ['CANCELED'] },
        managerUid: profile.uid,
      })
      .exec();
    return Promise.all(
      bookings.map((b: Booking) => this.bookingDtoFromBooking(b)),
    );
  }

  public async fetchFullBooking(formId: string, profile: JwtPayload) {
    const booking = await this.bookingModel.findOne({
      $and: [this.profileBookingFilter(profile), { formId: formId }],
    });
    return this.bookingDtoFromBooking(booking);
  }

  private async bookingDtoFromBooking(booking: Booking): Promise<BookingDto> {
    const eventData = await this.eventService.eventDataForBookingsList(
      booking.eventSignature,
    );
    const result = booking as BookingDto;
    result.event = eventData;
    return result;
  }

  public async buildSimpleContext(
    formId: string,
    profile: JwtPayload,
  ): Promise<SimpleBookingContext> {
    const booking = await this.fetchBooking(formId, profile);
    return {
      booking,
      profile,
    };
  }

  public async buildContext(
    formId: string,
    profile: JwtPayload,
  ): Promise<BookingContext> {
    let simpleCtx = await this.buildSimpleContext(formId, profile);
    const event = await this.eventService.fetchEvent(
      simpleCtx.booking.eventSignature,
    );
    const artists = await this.artistService.getArtists(
      simpleCtx.booking.artists.map((a) => a.code),
    );
    return {
      ...simpleCtx,
      event,
      artists,
    };
  }

  public async fetchFormData(
    formId: string,
    profile: JwtPayload,
  ): Promise<any> {
    const booking = await this.fetchBooking(formId, profile);
    return booking.formData;
  }

  public async fetchBooking(
    formId: string,
    profile: JwtPayload,
  ): Promise<Booking> {
    const booking = await this.bookingModel.findOne({ formId });
    if (!booking) {
      throw new NotFoundException();
    }
    if (profile.artistSignature) {
      const artistSignatures = booking.artists.map((a) => a.code);
      if (!artistSignatures.includes(profile.artistSignature)) {
        throw new UnauthorizedException();
      }
    } else {
      const uidsWithAccess = [booking.promoterUid, booking.managerUid];
      if (!uidsWithAccess.includes(profile.uid)) {
        throw new UnauthorizedException();
      }
    }
    return booking;
  }

  public async update(booking: Booking) {
    const update = await this.bookingModel.updateOne(
      { formId: booking.formId },
      { $set: booking },
    );
    this.logger.warn(
      `Updated booking ${booking.formId} with status ${booking.status}`,
    );
    if (!update?.modifiedCount) {
      throw new IllegalStateException(`Not updated booking ${booking.formId}`);
    }
  }

  public async findPromoterInfo(uid: string) {
    const booking = await this.bookingModel
      .findOne({ promoterUid: uid })
      .sort({ created: -1 })
      .select({ formData: true })
      .exec();

    const promoterInformation = booking?.formData?.promoterInformation;
    if (promoterInformation) {
      this.logger.log(`Found promoter info for profile: ${uid}`);
      return promoterInformation;
    }
    this.logger.log(`Not found promoter info for profile: ${uid}`);
    return null;
  }

  public async msgToPromoterOrManager(ctx: BookingContext, msg: string[]) {
    const uidsToSend = [ctx.booking.managerUid, ctx.booking.promoterUid].filter(
      (uid) => uid !== ctx.profile.uid,
    );
    for (let uid of uidsToSend) {
      const profile = await this.profileService.findTelegramChannedId(uid);
      const telegramChannelId = profile?.telegramChannelId;
      if (telegramChannelId) {
        const chatId = Number(telegramChannelId);
        if (!isNaN(chatId)) {
          const result = await this.telegramService.sendMessage(
            chatId,
            BotUtil.msgFrom(msg),
          );
        }
      }
    }
  }

  public async hasPermissionToBooking(
    formId: string,
    uid: string,
  ): Promise<boolean> {
    const result = await this.bookingModel
      .exists({
        formId: formId,
        $or: [
          { promoterUid: uid },
          { managerUid: uid },
          { 'artists.code': uid },
        ],
      })
      .exec();
    if (result) {
      this.logger.log(`User ${uid} has permission to Booking ${formId}`);
      return true;
    } else {
      throw new UnauthorizedException(
        `User ${uid} has no permission to Booking ${formId}`,
      );
    }
  }
}
