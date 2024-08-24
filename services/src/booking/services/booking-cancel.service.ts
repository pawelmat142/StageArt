import { Injectable, Logger } from "@nestjs/common";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { BookingService } from "./booking.service";
import { BookingAccessUtil } from "../util/booking-access.util";
import { BookingUtil } from "../util/booking.util";
import { BotUtil } from "../../telegram/util/bot.util";

@Injectable()
export class BookingCancelService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly bookingService: BookingService,
    ) {}

    public async cancelBooking(formId: string, profile: JwtPayload) {
        const ctx = await this.bookingService.buildContext(formId, profile)
        BookingAccessUtil.canCancelBooking(ctx.booking, profile)

        ctx.booking.status = 'CANCELED'
        BookingUtil.addStatusToHistory(ctx.booking, ctx.profile)

        await this.bookingService.update(ctx.booking)

        this.bookingService.msgToPromoterOrManager(ctx, [
            `Cancelled booking at ${BotUtil.formatDate(ctx.event.startDate)}`,
            `Event name: ${ctx.event.name}`,
            `Artist: ${ctx.artistNames.join(', ')}`
        ])

        this.logger.log(`Cancelled booking ${ctx.booking.formId}, by ${ctx.profile.uid}`)
        return ctx.booking
    }

}