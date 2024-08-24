import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArtistService } from '../../artist/artist.service';
import { EventService } from '../../event/event.service';
import { IllegalStateException } from '../../global/exceptions/illegal-state.exception';
import { JwtPayload } from '../../profile/auth/jwt-strategy';
import { BookingPanelDto } from '../model/booking.dto';
import { Booking, StatusHistory } from '../model/booking.model';
import { SubmitService } from './submit.service';
import { BookingUtil } from '../util/booking.util';

@Injectable()
export class BookingService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<Booking>,
        private readonly submitService: SubmitService,
        private readonly artistService: ArtistService,
        private readonly eventService: EventService,
    ) {}



    public async submitForm(formId: string, profile: JwtPayload) {
        const checkFormId = await this.bookingModel.findOne({ formId: formId })
        if (checkFormId) {
            throw new IllegalStateException(`Booking for form ${formId} already exists`)
        }
        const booking = await this.submitService.submitForm(formId, profile)
        BookingUtil.addStatusToHistory(booking, profile)
        await new this.bookingModel(booking).save()
        return
    }



    public async fetchProfileBookings(profile: JwtPayload): Promise<BookingPanelDto[]> {
        const uid = profile.uid
        const bookings = await this.bookingModel.find({ $or: [
            { promotorUid: uid },
            { managerUid: uid },
            { artistSignatures: profile.artistSignature }
        ] })

        const profileBookings = await Promise.all(bookings.map(b => this.bookingDtoFromBooking(b)))
        this.logger.log(`Fetch ${profileBookings.length} profile bookings for ${uid}`)
        return profileBookings
    }

    private async bookingDtoFromBooking(booking: Booking): Promise<BookingPanelDto> {
        const eventData = await this.eventService.eventDataForBookingsList(booking.eventSignature)
        return {
            formId: booking.formId,
            promotorUid: booking.promotorUid,
            managerUid: booking.managerUid,
            status: booking.status,
            submitDate: booking.submitDate,
            artistSignatures: booking.artistSignatures,
            artistNames: await this.artistService.listNamesBySignatures(booking.artistSignatures),
            eventName: eventData.name,
            eventStartDate: eventData.startDate,
            eventEndDate: eventData.endDate,
        }
    }

    public async fetchBooking(formId: string, profile: JwtPayload): Promise<Booking> {
        const booking = await this.bookingModel.findOne({ formId })
        if (!booking) {
            throw new NotFoundException()
        }
        if (profile.artistSignature) {
            if (!booking.artistSignatures.includes(profile.artistSignature)) {
                throw new UnauthorizedException()
            }
        } else {
            const uidsWithAccess = [
                booking.promotorUid,
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

    public async findPromotorInfo(uid: string) {
        const booking = await this.bookingModel.findOne({ promotorUid: uid })
            .sort({ submitDate: -1 })
            .select({ formData: true })

        const promotorInformation = booking?.formData?.promotorInformation
        if (promotorInformation) {
            this.logger.log(`Found promotor info for profile: ${uid}`)
            return promotorInformation  
        }
        this.logger.log(`Not found promotor info for profile: ${uid}`)
        return null
    }
    
}
