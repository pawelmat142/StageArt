import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ArtistService } from "../artist/artist.service";
import { FormService } from "../form/form.service";
import { JwtPayload } from "../profile/auth/jwt-strategy";
import { IllegalStateException } from "../global/exceptions/illegal-state.exception";
import { Booking } from "./model/booking.model";
import { ProfileService } from "../profile/profile.service";
import { EventService } from "../event/event.service";

@Injectable()
export class SubmitService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly artistService: ArtistService,
        private readonly formService: FormService,
        private readonly profileService: ProfileService,
        private readonly eventService: EventService,
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
            submitDate: new Date(),
            created: new Date()
        }

        await this.profileService.updatePromoterInfoWhenSubmitForm(booking.formData, profile)

        await this.formService.submitForm(formId)

        await this.eventService.processBookingForm(booking)

        await this.artistService.processBookingForm(booking)
        
        this.logger.log(`[STOP] submitting form ${formId}`)
        return booking as Booking
    }


}