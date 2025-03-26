import { Injectable, Logger } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { BookingAccessUtil } from "../util/booking-access.util";
import { BotUtil } from "../../telegram/util/bot.util";
import { BookingUtil } from "../util/booking.util";
import { ArtistUtil } from "../../artist/artist.util";
import { DocumentsStepRequest } from "../model/interfaces";
import { BookingDto } from "../model/booking.dto";

@Injectable()
export class BookingDocumentsService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly bookingService: BookingService,
    ) {}


    public async requestDocuments(documentsStepRequest: DocumentsStepRequest, profile: JwtPayload): Promise<BookingDto> {
        const ctx = await this.bookingService.buildContext(documentsStepRequest.formId, profile)
        BookingAccessUtil.canRequestBookingDocuments(ctx.booking, profile)

        ctx.booking.status = 'DOCUMENTS'
        ctx.booking.artistFee = documentsStepRequest.artistFee
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