import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { BookingAccessUtil } from "../util/booking-access.util";
import { BotUtil } from "../../telegram/util/bot.util";
import { DocumentService } from "../../document/document.service";
import { Template } from "../../document/doc-util";
import { BookingUtil } from "../util/booking.util";
import { BookingContractGenerator } from "../../document/generators/booking-contract.generator";
import { ArtistUtil } from "../../artist/artist.util";

@Injectable()
export class BookingDocumentsService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly bookingService: BookingService,
        private readonly documentService: DocumentService,
    ) {}


    public async requestDocuments(formId: string, profile: JwtPayload) {
        const ctx = await this.bookingService.buildContext(formId, profile)
        BookingAccessUtil.canRequestBookingDocuments(ctx.booking, profile)

        ctx.booking.status = 'DOCUMENTS_REQUESTED'
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

    public async getPdf(formId: string, templateName: Template, profile: JwtPayload): Promise<Buffer> {
        const ctx = await this.bookingService.buildContext(formId, profile)
        if (templateName === 'contract') {
            const documentGenerator = new BookingContractGenerator(ctx)
            const html = documentGenerator.generate()
            const pdf = await this.documentService.getPdf(html)
            return pdf
        }
        throw new BadRequestException(`Unsupported template ${templateName}`)
    }

}