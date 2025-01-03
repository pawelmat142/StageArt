import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './model/event.model';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { EventCreationService } from './event.duplicate.service';
import { BookingSubmitCtx } from '../booking/services/submit.service';

@Injectable()
export class EventService {
    
    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Event.name) private eventModel: Model<Event>,
        private readonly eventCreationService: EventCreationService,
    ) {}

    public fetchPromoterEvents(profile: JwtPayload) {
        return this.eventModel.find({ promoterUid: profile.uid })
    }

    public fetchEvent(signature: string) {
        return this.eventModel.findOne({ signature }).lean().exec()
    }

    public async eventDataForBookingsList(signature: string) {
        const event = await this.eventModel.findOne({ signature }).select(['name', 'startDate', 'endDate'])
        if (!event) {
            throw new NotFoundException(`Not found event by signature: ${signature}`)
        }
        return event
    }

    public async processBookingForm(ctx: BookingSubmitCtx, params?: { skipEventSearch: boolean  }) {
        const event = await this.eventCreationService.findEventDuplicateOrCreateNew(ctx, params)
        ctx.event = event
        ctx.booking.eventSignature = event.signature
    }
}
