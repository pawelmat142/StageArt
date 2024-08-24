import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ArtistService } from "../../artist/artist.service";
import { EventService } from "../../event/event.service";
import { FormService } from "../../form/form.service";
import { IllegalStateException } from "../../global/exceptions/illegal-state.exception";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { ProfileService } from "../../profile/profile.service";
import { TelegramService } from "../../telegram/telegram.service";
import { BotUtil } from "../../telegram/util/bot.util";
import { Booking } from "../model/booking.model";
import { Event } from "../../event/model/event.model";

export interface BookingSubmitCtx {
    booking: Partial<Booking>
    profile: JwtPayload,
    event?: Event,
    artistNames?: string[]
}

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

    async submitForm(formId: string, profile: JwtPayload): Promise<BookingSubmitCtx> {
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

        const ctx: BookingSubmitCtx = {
            booking,
            profile,
        }
        
        await this.eventService.processBookingForm(ctx)
        
        await this.artistService.processBookingForm(ctx)

        this.logger.log(`[STOP] submitting form ${formId}`)
        return ctx
    }

    public async msgToManagerAboutSubmitedForm(ctx: BookingSubmitCtx) {
        const telegramChannelId = await this.profileService.findTelegramChannedId(ctx.booking.managerUid)
        if (telegramChannelId) {
            const chatId = Number(telegramChannelId.telegramChannelId)
            if (!isNaN(chatId)) {
                const result = await this.telegramService.sendMessage(chatId, BotUtil.msgFrom([
                    `New booking form submitted`,
                    `Event: ${ctx.event.name} at ${BotUtil.formatDate(ctx.event.startDate)}`,
                    `Artist: ${ctx.artistNames.join(', ')}`
                ]))
                if (result) {
                    return
                }
            }
        }
        this.logger.warn(`Could not send telegram msg to manager ${ctx.booking.managerUid} about booking submitted ${ctx.booking.formId}`)
    }

}