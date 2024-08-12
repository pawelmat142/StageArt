import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from './model/booking.model';
import { Model } from 'mongoose';
import { FormService } from '../form/form.service';

@Injectable()
export class BookingService {

    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<Booking>,
        private readonly formService: FormService
    ) {}

    async submitForm(formId: string) {
        const form = await this.formService.findForm(formId)
        if (!form) {
            throw new NotFoundException()
        }

        console.log('submit form ')
        console.log(formId)
    }
}
