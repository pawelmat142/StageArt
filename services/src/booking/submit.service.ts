import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ArtistService } from "../artist/artist.service";
import { FormService } from "../form/form.service";
import { JwtPayload } from "../profile/auth/jwt-strategy";
import { IllegalStateException } from "../global/exceptions/illegal-state.exception";
import { Booking } from "./model/booking.model";
import { ProfileService } from "../profile/profile.service";
import { EventService } from "../event/event.service";
import { TelegramService } from "../telegram/telegram.service";
import { BotUtil } from "../telegram/util/bot.util";
import { Event } from "../event/model/event.model";

@Injectable()
export class SubmitService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly artistService: ArtistService,
        private readonly formService: FormService,
        private readonly profileService: ProfileService,
        private readonly eventService: EventService,
        private readonly telegramService: TelegramService,
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
            promotorUid: profile.uid,
            managerUid: 'MOCK TODO',
            status: 'SUBMITTED',
            formData: form.data,
            submitDate: new Date(),
            created: new Date()
        }

        await this.profileService.updatePromotorInfoWhenSubmitForm(booking.formData, profile)

        await this.formService.submitForm(formId)

        const event = await this.eventService.processBookingForm(booking)

        await this.artistService.processBookingForm(booking)
        
        this.msgToManagerAboutSubmitedForm(booking, event)
        this.logger.log(`[STOP] submitting form ${formId}`)
        return booking as Booking
    }


    private async msgToManagerAboutSubmitedForm(booking: Partial<Booking>, event: Event) {
        const telegramChannelId = await this.profileService.findTelegramChannedId(booking.managerUid)
        if (telegramChannelId) {
            const artistNames = await this.artistService.listNamesBySignatures(booking.artistSignatures)
            const chatId = Number(telegramChannelId.telegramChannelId)
            if (!isNaN(chatId)) {
                const result = await this.telegramService.sendMessage(chatId, BotUtil.msgFrom([
                    `New booking form submitted`,
                    `Event: ${event.name} at ${BotUtil.formatDate(event.startDate)}`,
                    `Artist: ${artistNames.join(', ')}`
                ]))
                if (result) {
                    return
                }
            }
        }
        this.logger.warn(`Could not send telegram msg to manager ${booking.managerUid} about booking submitted ${booking.formId}`)
    }

}