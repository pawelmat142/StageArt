import { Injectable, Logger } from "@nestjs/common";
import { ArtistService } from "../../artist/artist.service";
import { Booking, BookingDocument, BookingStatus } from "../model/booking.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { SelectorItem } from "../../artist/artist.controller";
import { BookingUtil } from "../util/booking.util";

export interface EventInformation {
    performanceStartDate: Date
    performanceEndDate?: Date
    eventName?: string
    eventCountry?: SelectorItem
    venueCapacity?: number
}

export interface TimelineItem {
    id: string,
    uid?: string,
    status: BookingStatus,
    eventSignature: string,
    startDate: Date,
    endDate?: Date
    countryCode?: string,
    header: string,
    subheader?: string,
    txt?: string
    formData: { eventInformation: EventInformation }
}

@Injectable()
export class ArtistTimelineService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<Booking>,
        private readonly artistService: ArtistService,
    ) {}

    public async getTimeline(artistSignature: string): Promise<TimelineItem[]> {
        const bookings = await this.getArtistBookings(artistSignature)
        const timelineItems = bookings.map(_booking => {
            return BookingUtil.timelineItem(_booking.toObject())
        })
        const timelineResult = await this.artistService.getTimeline(artistSignature)
        const timeline = timelineResult.timeline
        if (timeline) {
            timelineItems.push(...timeline)
        }
        return timelineItems
    }

    // 'SUBMITTED' | 'DOCUMENTS' | 'CHECKLIST_COMPLETE' | 'PENDING' | 'READY' | 'CANCELED'
    private async getArtistBookings(artistSignature: string): Promise<BookingDocument[]> {
        return this.bookingModel.find({
            "artists.code": artistSignature,
            status: { $nin: ['CANCELED'] },
        }, {
            status: true,
            formId: true,
            "formData.eventInformation": true,
            eventSignature: true,
        }).exec()
    }

}