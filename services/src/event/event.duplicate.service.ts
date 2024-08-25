import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Event } from "./model/event.model";
import { Model } from "mongoose";
import { Booking } from "../booking/model/booking.model";
import { BookingFormProcessor, DatePeriod } from "../booking/util/booking-form-processor";
import { Util } from "../global/utils/util";
import { BookingSubmitCtx } from "../booking/services/submit.service";

@Injectable()
export class EventCreationService {
    
    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Event.name) private eventModel: Model<Event>,
    ) {}


    public async findEventDuplicateOrCreateNew(ctx: BookingSubmitCtx): Promise<Event> {
        const newEventName = this.processEventName(ctx.booking)
        
        const promoterEvents = await this.eventModel.find({
            promoterUid: ctx.booking.promoterUid,
            startDate: { $gt: new Date() }
        })

        for (let promoterEvent of promoterEvents) {
            const nameDuplicated = this.isEventNameDuplicated(newEventName, promoterEvent.name)
            if (nameDuplicated) {
                this.logger.log(`Found event with similar name: ${newEventName} related to promoter: ${ctx.booking.promoterUid}`)
                return promoterEvent
            }
        }
        
        this.logger.log(`Not found event with similar name: ${newEventName}, related to promoter: ${ctx.booking.promoterUid}`)
        return this.createNewEvent(newEventName, ctx.booking)
    }


    private async createNewEvent(newEventName: string, booking: Partial<Booking>): Promise<Event> {
        const dates = this.processEventDates(booking)
        const event = new this.eventModel({
            signature: this.prepareSignature(newEventName),
            promoterUid: booking.promoterUid,
            status: 'CREATED',
            name: newEventName,
            startDate: dates.startDate,
            endDate: dates.endDate,
            formData: BookingFormProcessor.findEventInformation(booking.formData),

            created: new Date(),
            modified: new Date(),
        })
        await event.save()
        this.logger.log(`Created new event ${newEventName}, related to promoter: ${booking.promoterUid}`)
        return event
    }

    // Funkcja do sprawdzania, czy podobne wydarzenie już istnieje w bazie
    private isEventNameDuplicated(newEventName: string, promoterEventName: string, threshold = 5) {
        const distance = this.levenshtein(newEventName, promoterEventName);
        this.logger.warn(`Calculated distance ${distance} between names: ${newEventName} - ${promoterEventName}`)
        
        if (distance <= threshold) {
            return true;
        }
        return false;
    }

    private levenshtein(a: string, b: string) {
        const matrix = [];
    
        // Inicjalizacja pierwszego wiersza i kolumny
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
    
        // Obliczanie odległości
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // zamiana
                        matrix[i][j - 1] + 1,     // wstawienie
                        matrix[i - 1][j] + 1      // usunięcie
                    );
                }
            }
        }
    
        return matrix[b.length][a.length];
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
        return `${eventName.replace(/ /g, "_").toLocaleLowerCase()}-${now.slice(-4)}`
    }


}