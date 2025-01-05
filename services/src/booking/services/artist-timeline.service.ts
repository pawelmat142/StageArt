import { Injectable, Logger } from "@nestjs/common";
import { ArtistService } from "../../artist/artist.service";
import { Booking, BookingDocument, BookingStatus } from "../model/booking.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { SelectorItem } from "../../artist/artist.controller";
import { JwtPayload } from "../../profile/auth/jwt-strategy";

export interface EventInformation {
    performanceStartDate: Date
    performanceEndDate?: Date
    eventName?: string
    eventCountry?: SelectorItem
    venueCapacity?: number
}

export interface TimelineItem {
    formId: string,
    status: BookingStatus,
    eventSignature: string,
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
        const timelineItems = bookings.map(booking => booking.toObject())
        return timelineItems as TimelineItem[]
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