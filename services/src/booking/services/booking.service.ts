import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArtistService } from '../../artist/artist.service';
import { EventService } from '../../event/event.service';
import { IllegalStateException } from '../../global/exceptions/illegal-state.exception';
import { JwtPayload } from '../../profile/auth/jwt-strategy';
import { BookingDto } from '../model/booking.dto';
import { Booking } from '../model/booking.model';
import { SubmitService } from './submit.service';
import { Event } from '../../event/model/event.model';
import { ProfileService } from '../../profile/profile.service';
import { TelegramService } from '../../telegram/telegram.service';
import { BotUtil } from '../../telegram/util/bot.util';
import { Artist } from '../../artist/model/artist.model';

export interface BookingContext {
    profile: JwtPayload
    booking: Booking
    event: Event
    artists: Artist[]
}

@Injectable()
export class BookingService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<Booking>,
        private readonly submitService: SubmitService,
        private readonly artistService: ArtistService,
        private readonly eventService: EventService,
        private readonly profileService: ProfileService,
        private readonly telegramService: TelegramService,
    ) {}

    public async submitForm(formId: string, profile: JwtPayload) {
        const checkFormId = await this.bookingModel.findOne({ formId: formId })
        if (checkFormId) {
            throw new IllegalStateException(`Booking for form ${formId} already exists`)
        }
        const ctx = await this.submitService.submitForm(formId, profile)

        await this.validateBookingDuplicate(ctx.booking)
        this.submitService.msgToManagerAboutSubmitedForm(ctx)

        return new this.bookingModel(ctx.booking).save()
    }

    private async validateBookingDuplicate(booking: Partial<Booking>) {
        const duplicate = await this.bookingModel.findOne({
            "artists.code": { $in: booking.artists.map(a => a.code) },
            eventSignature: booking.eventSignature
        })
        if (duplicate) {
            throw new IllegalStateException(`Booking for this event and artist already exists!`)
        }
    }

    public async fetchProfileBookings(profile: JwtPayload): Promise<BookingDto[]> {
        const uid = profile.uid
        const bookings = await this.bookingModel.find({ $or: [
            { promoterUid: uid },   
            { managerUid: uid },
            { "artists.code": profile.artistSignature }
        ] }).lean().exec()
        
        const profileBookings = await Promise.all(bookings.map((b: Booking) => this.bookingDtoFromBooking(b)))
        this.logger.log(`Fetch ${profileBookings.length} profile bookings for ${uid}`)
        return profileBookings
    }

    private async bookingDtoFromBooking(booking: Booking): Promise<BookingDto> {
        const eventData = await this.eventService.eventDataForBookingsList(booking.eventSignature)
        const result = booking as BookingDto
        result.event = eventData
        return result
    }

    
    public async buildContext(formId: string, profile: JwtPayload): Promise<BookingContext> {
        const booking = await this.fetchBooking(formId, profile)
        const event = await this.eventService.fetchEvent(booking.eventSignature)
        const artists = await this.artistService.getArtists(booking.artists.map(a => a.code))
        return {
            event,
            booking,
            profile,
            artists
        }
    }

    public async fetchFormData(formId: string, profile: JwtPayload): Promise<any> {
        const booking = await this.fetchBooking(formId, profile)
        return booking.formData
    }

    public async fetchBooking(formId: string, profile: JwtPayload): Promise<Booking> {
        const booking = await this.bookingModel.findOne({ formId })
        if (!booking) {
            throw new NotFoundException()
        }
        if (profile.artistSignature) {
            const artistSignatures = booking.artists.map(a => a.code)
            if (!artistSignatures.includes(profile.artistSignature)) {
                throw new UnauthorizedException()
            }
        } else {
            const uidsWithAccess = [
                booking.promoterUid,
                booking.managerUid,
            ]
            if (!uidsWithAccess.includes(profile.uid)) {
                throw new UnauthorizedException()
            }
        }
        return booking
    }

    public async update(booking: Booking) {
        this.logger.warn(`Updated booking ${booking.formId} with status ${booking.status}`)
        const update = await this.bookingModel.updateOne({ formId: booking.formId }, { $set: booking })
        if (!update?.modifiedCount) {
            throw new IllegalStateException(`Not updated booking ${booking.formId}`)
        }
    }

    public async findPromoterInfo(uid: string) {
        const booking = await this.bookingModel.findOne({ promoterUid: uid })
            .sort({ created: -1 })
            .select({ formData: true })

        const promoterInformation = booking?.formData?.promoterInformation
        if (promoterInformation) {
            this.logger.log(`Found promoter info for profile: ${uid}`)
            return promoterInformation  
        }
        this.logger.log(`Not found promoter info for profile: ${uid}`)
        return null
    }

    public async msgToPromoterOrManager(ctx: BookingContext, msg: string[]) {
        const uidsToSend = [
            ctx.booking.managerUid,
            ctx.booking.promoterUid,
        ].filter(uid => uid !== ctx.profile.uid)
        for (let uid of uidsToSend) {
            const profile = await this.profileService.findTelegramChannedId(uid)
            const telegramChannelId = profile?.telegramChannelId
            if (telegramChannelId) {
                const chatId = Number(telegramChannelId)
                if (!isNaN(chatId)) {
                    const result = await this.telegramService.sendMessage(chatId, BotUtil.msgFrom(msg))
                }
            }
        }
    }


    
}
