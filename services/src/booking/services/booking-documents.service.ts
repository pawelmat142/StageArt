import { Injectable, Logger } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { BookingAccessUtil } from "../util/booking-access.util";
import { BotUtil } from "../../telegram/util/bot.util";
import { BookingUtil } from "../util/booking.util";
import { ArtistUtil } from "../../artist/artist.util";

@Injectable()
export class BookingDocumentsService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly bookingService: BookingService,
    ) {}


    public async requestDocuments(formId: string, profile: JwtPayload) {
        const ctx = await this.bookingService.buildContext(formId, profile)
        BookingAccessUtil.canRequestBookingDocuments(ctx.booking, profile)

        ctx.booking.status = 'DOCUMENTS'
        BookingUtil.addStatusToHistory(ctx.booking, profile)
        await this.bookingService.update(ctx.booking)
        
        this.bookingService.msgToPromoterOrManager(ctx, [
            `Requested documents step for booking at ${BotUtil.formatDate(ctx.event.startDate)}`,
            `Event name: ${ctx.event.name}`,
            `Artist: ${ArtistUtil.artistNames(ctx.artists)}`,
        ])
        this.logger.log(`Requested documents step for booking ${ctx.booking.formId}, by ${ctx.profile.uid}`)
        return ctx.booking
    }

}