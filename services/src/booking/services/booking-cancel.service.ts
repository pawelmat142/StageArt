import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { BookingService } from "./booking.service";
import { BookingAccessUtil } from "../util/booking-access.util";
import { Booking } from "../model/booking.model";
import { BookingUtil } from "../util/booking.util";
import { TelegramService } from "../../telegram/telegram.service";
import { ProfileService } from "../../profile/profile.service";
import { BotUtil } from "../../telegram/util/bot.util";
import { EventService } from "../../event/event.service";
import { ArtistService } from "../../artist/artist.service";

@Injectable()
export class BookingCancelService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly bookingService: BookingService,
        private readonly telegramService: TelegramService,
        private readonly profileService: ProfileService,
        private readonly eventService: EventService,
        private readonly artistService: ArtistService,
    ) {}

    public async cancelBooking(formId: string, profile: JwtPayload) {
        const booking = await this.bookingService.fetchBooking(formId, profile)
        BookingAccessUtil.canCancelBooking(booking, profile)

        booking.status = 'CANCELED'
        BookingUtil.addStatusToHistory(booking, profile)

        await this.bookingService.update(booking)
        
        this.msgToPromoterOrManager(booking, profile)
        return booking
    }


    private async msgToPromoterOrManager(booking: Booking, profile: JwtPayload) {
        const uidsToSend = [
            booking.managerUid,
            booking.promotorUid,
        ].filter(uid => uid !== profile.uid)

        for (let uid of uidsToSend) {
            const profile = await this.profileService.findTelegramChannedId(uid)
            const telegramChannelId = profile?.telegramChannelId
            if (telegramChannelId) {
                const chatId = Number(telegramChannelId)
                if (!isNaN(chatId)) {
                    const event = await this.eventService.fetchEvent(booking.eventSignature)
                    if (!event) {
                        throw new NotFoundException(`Not found event ${booking.eventSignature}}`)
                    }
                    const artistNames = await this.artistService.listNamesBySignatures(booking.artistSignatures)
                    if (!artistNames?.length) {
                        throw new NotFoundException(`Not found artist name`)
                    }
                    const msg = await this.telegramService.sendMessage(chatId, BotUtil.msgFrom([
                        `Cancelled booking at ${BotUtil.formatDate(event.startDate)}`,
                        `Event name: ${event.name}`,
                        `Artist: ${artistNames.join(', ')}`
                    ]))

                }


            }
        }

    }


}