import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './model/booking.model';
import { Model } from 'mongoose';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { SubmitService } from './util/submit.service';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { BookingListDto } from './model/booking.dto';

@Injectable()
export class BookingService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<Booking>,
        private readonly submitService: SubmitService,
    ) {}

    public async submitForm(formId: string, profile: JwtPayload) {
        const checkFormId = await this.bookingModel.findOne({ formId: formId })
        if (checkFormId) {
            throw new IllegalStateException(`Booking for form ${formId} already exists`)
        }
        const booking = await this.submitService.submitForm(formId, profile)
        await new this.bookingModel(booking).save()
        return
    }


    public async fetchProfileBookings(profile: JwtPayload): Promise<BookingListDto[]> {
        const uid = profile.uid
        const managerBookings = await this.bookingModel.find({ $or: [
            { promoterUid: uid },
            { managerUid: uid }
        ] })
        const promoterBookings = await this.bookingModel.find({ promoterUid: uid })
        this.logger.log(`Fetch profile bookings for ${uid}`)
        return managerBookings
    }
    
}
