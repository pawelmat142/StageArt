import { BookingContext } from "../../booking/services/booking.service"
import { EventUtil } from "../../event/event-util";
import { IllegalStateException } from "../../global/exceptions/illegal-state.exception";
import { Template } from "../doc-util"
import { Util } from "../../global/utils/util";
import { BookingUtil } from "../../booking/util/booking.util";
import { Injectable } from "@nestjs/common";
import { DocumentService } from "../document.service";
import { ProfileService } from "../../profile/profile.service";
import { FormUtil } from "../../form/form.util";

export interface BookingContractDocumentData {
    year: string

    promoterName: string
    promoterCompanyName: string
    promoterAdress: string
    promoterPhone: string
    promoterEmail: string

    artistName: string
    artistRealName: string
    artistPerformance: string
    artistCountry: string
    artistFee: string

    eventName: string
    eventDate: string
    eventVenue: string

    agencyName: string
    agencyCompanyName: string
    accountHolder: string
    nameOfBank: string
    accountAddress: string
    accountNumber: string
    accountSwift: string
    agencyEmail: string
    agencyFooterString: string
    agencyPhone: string

    depositDeadline: string
    feeDeadline: string

    contractDate: string
}

@Injectable()
export class BookingContractDocumentService {

    private readonly template: Template = 'contract'

    constructor(
        private readonly documentService: DocumentService,
        private readonly profileService: ProfileService,
    ) {}

    public async generate(ctx: BookingContext): Promise<Buffer> {
        const data = await this.prepareData(ctx)
        const pdf = await this.documentService.generatePdfOfTemplate(this.template, data)
        return pdf
    }

    private async prepareData(ctx: BookingContext): Promise<BookingContractDocumentData> {
        const formData = ctx.booking.formData
        if (!formData) {
            throw new IllegalStateException('Missing form data')
        }

        const artistProfile = await this.profileService.findByArtistSignature(ctx.artists[0].signature)

        const now = new Date()

        const promoterCountry = this.get(formData, 'promoterInformation.companyCountry.name')
        const promoterAddress = this.get(formData, 'promoterInformation.companyAddress') 
        
        const eventCountry = this.get(formData, 'eventInformation.eventCountry.name')
        
        const eventAddress = this.get(formData, 'eventInformation.venueAddress')
        
        const artist = ctx.artists[0]
        const artistCountry = artist.country.name
        
        return {
            year: now.getFullYear().toString(),
            promoterName: this.get(formData, 'promoterInformation.promoterName'),
            promoterCompanyName: this.get(formData, 'promoterInformation.companyName'),
            promoterAdress: `${promoterAddress}, ${promoterCountry}`,
            promoterPhone: this.get(formData, 'promoterInformation.phoneNumber'),
            promoterEmail: this.get(formData, 'promoterInformation.email'),

            artistName: artist.name,
            artistRealName: `${artistProfile.firstName} ${artistProfile.lastName}`,
            artistPerformance: `???`,//TODO
            artistCountry: artistCountry,
            artistFee: '??', // TODO skad to?

            eventName: ctx.event.name,
            eventDate: EventUtil.dateString(ctx.event),
            eventVenue: `${eventAddress}, ${eventCountry}`,

            agencyName: 'TODO',
            agencyCompanyName: 'TODO',
            accountHolder: 'TODO',
            nameOfBank: 'TODO',
            accountAddress: 'TODO',
            accountNumber: 'TODO',
            accountSwift: 'TODO',
            agencyEmail: 'TODO',
            agencyFooterString: 'TODO',
            agencyPhone: 'TODO',

            depositDeadline: Util.formatDate(BookingUtil.depositDeadline(ctx.event)),
            feeDeadline: Util.formatDate(BookingUtil.feeDeadline(ctx.event)),
        
            contractDate: Util.formatDate(now)
        }
    }

    private get(formData: any, path: string): any {
        return FormUtil.get(formData, path)
    }
}