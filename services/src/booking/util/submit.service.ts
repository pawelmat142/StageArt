import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ArtistService } from "../../artist/artist.service";
import { FormService } from "../../form/form.service";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { IllegalStateException } from "../../global/exceptions/illegal-state.exception";
import { BookingFormProcessor } from "./booking-form-processor";
import { Booking } from "../model/booking.model";
import { Util } from "../../global/utils/util";
import { ProfileService } from "../../profile/profile.service";

@Injectable()
export class SubmitService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly artistService: ArtistService,
        private readonly formService: FormService,
        private readonly profileService: ProfileService,
    ) {}

    async submitForm(formId: string, profile: JwtPayload): Promise<Booking> {
        this.logger.log(`[START] submitting form ${formId}`)
        const form = await this.formService.findForm(formId)
        if (!form?.data) {
            throw new NotFoundException()
        }
        
        if (!profile) {
            throw new IllegalStateException("Missing profile")
        }

        // TODO prevent set type by ngrx actions 
        delete form.data.type
        
        const booking: Partial<Booking> = {
            formId: form.id,
            promoterUid: profile.uid,
            managerUid: 'MOCK TODO',
            status: 'SUBMITTED',
            formData: form.data,
            submitDate: new Date()
        }   
        
        this.processEventDates(booking)
        this.processEventName(booking)

        await this.formService.submitForm(formId)

        await this.profileService.updatePromoterInfoWhenSubmitForm(booking.formData, profile)
        
        await this.artistService.processBookingForm(booking)
        
        this.logger.log(`[STOP] submitting form ${formId}`)
        return booking as Booking
    }


    private processEventDates(booking: Partial<Booking>) {
        const dates = BookingFormProcessor.findEventDates(booking.formData)
        if (!dates) {
            throw new BadRequestException("Missing event date")
        }
        this.logger.log(`Found event start date: ${Util.formatDate(dates.startDate)}${dates.endDate ? `, end date: ${Util.formatDate(dates.endDate)}` : ''}` )
        booking.startDate = dates.startDate
        booking.endDate = dates.endDate
    }

    private processEventName(booking: Partial<Booking>) {
        const eventName = BookingFormProcessor.findEventName(booking.formData)
        if (!eventName) {
            throw new BadRequestException("Missing eventName")
        }
        this.logger.log(`Found event name : ${eventName}`)
        booking.eventName = eventName
    }

}