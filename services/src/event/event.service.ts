import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../booking/model/booking.model';
import { BookingFormProcessor, DatePeriod } from '../booking/util/booking-form-processor';
import { Util } from '../global/utils/util';
import { Event } from './model/event.model';

@Injectable()
export class EventService {
    
    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Event.name) private eventModel: Model<Event>,
    ) {}


    public async processBookingForm(booking: Partial<Booking>) {
        const eventName = this.processEventName(booking)
        const dates = this.processEventDates(booking)
        const event = new this.eventModel({
            signature: this.prepareSignature(eventName),
            promoterUid: booking.promoterUid,
            status: 'CREATED',
            name: eventName,
            startDate: dates.startDate,
            endDate: dates.endDate,
            eventInformationFormData: BookingFormProcessor.findEventInformation(booking.formData),

            created: new Date()
        })

        await event.save()

        booking.eventSignature = event.signature
    }


    private processEventDates(booking: Partial<Booking>): DatePeriod {
        const dates = BookingFormProcessor.findEventDates(booking.formData)
        if (!dates) {
            throw new BadRequestException("Missing event date")
        }
        this.logger.log(`Found event start date: ${Util.formatDate(dates.startDate)}${dates.endDate ? `, end date: ${Util.formatDate(dates.endDate)}` : ''}` )
        return dates
    }

    private processEventName(booking: Partial<Booking>):string {
        const eventName = BookingFormProcessor.findEventName(booking.formData)
        if (!eventName) {
            throw new BadRequestException("Not found event name")
        }
        this.logger.log(`Found event name : ${eventName}`)
        return eventName
    }

    private prepareSignature(eventName: string) {
        const now = Date.now().toString()
        return `${eventName.replace(' ', '_').toLocaleLowerCase()}-${now.slice(-4)}`

    }
}
