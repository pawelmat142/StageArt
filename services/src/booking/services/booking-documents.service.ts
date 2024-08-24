import { Injectable, Logger } from "@nestjs/common";
import { BookingContext, BookingService } from "./booking.service";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { BookingAccessUtil } from "../util/booking-access.util";
import { BotUtil } from "../../telegram/util/bot.util";



@Injectable()
export class BookingDocumentsService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly bookingService: BookingService,
    ) {}


    public async requestDocuments(formId: string, profile: JwtPayload) {
        const ctx = await this.bookingService.buildContext(formId, profile)
        BookingAccessUtil.canRequestBookingDocuments(ctx.booking, profile)

        console.log(ctx.booking)
        
        // booking.status = 'DOCUMENTS_REQUESTED'
        // BookingUtil.addStatusToHistory(booking, profile)
        // await this.bookingService.update(booking)
        
        this.bookingService.msgToPromoterOrManager(ctx, [
            `Requested documents step for booking at ${BotUtil.formatDate(ctx.event.startDate)}`,
            `Event name: ${ctx.event.name}`,
            `Artist: ${ctx.artistNames.join(', ')}`,
        ])
        this.logger.log(`Requested documents step for booking ${ctx.booking.formId}, by ${ctx.profile.uid}`)
        return ctx.booking
    }

}