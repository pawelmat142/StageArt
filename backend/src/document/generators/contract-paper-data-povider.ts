import { Injectable } from "@nestjs/common";
import { ProfileService } from "../../profile/profile.service";
import { BookingContext } from "../../booking/model/interfaces";
import { IllegalStateException } from "../../global/exceptions/illegal-state.exception";
import { PaperUtil } from "../paper-util";
import { BookingUtil } from "../../booking/util/booking.util";
import { Util } from "../../global/utils/util";
import { FormUtil } from "../../form/form.util";
import { EventUtil } from "../../event/event-util";

@Injectable()
export class ContractPaperDataProvider {

    constructor(
        private readonly profileService: ProfileService,
    ) {}


    public async prepareData(ctx: BookingContext): Promise<any> {

        const formData = ctx.booking.formData
        if (!formData) {
            throw new IllegalStateException('Missing form data')
        }


        const artistProfile = await this.profileService.findByArtistSignature(ctx.artists[0].signature)
        const managerData = await this.profileService.fetchManagerData(ctx.booking.managerUid)

        const now = new Date()

        const promoterCountry = this.get(formData, 'promoterInformation.companyCountry.name')
        const promoterAddress = this.get(formData, 'promoterInformation.companyAddress') 
        
        const eventCountry = this.get(formData, 'eventInformation.eventCountry.name')
        
        const eventAddress = this.get(formData, 'eventInformation.venueAddress')
        
        const artist = ctx.artists[0]
        const artistCountry = artist.country.name

        let performanceDuration = this.get(formData, 'performanceDetails.duration')
        if (performanceDuration) {
            performanceDuration += ` minutes`
        }
        return {
            year: now.getFullYear().toString(),
            promoterName: `${this.get(formData, 'promoterInformation.promoterFirstName')} ${this.get(formData, 'promoterInformation.promoterLastName')}`,
            promoterCompanyName: this.get(formData, 'promoterInformation.companyName'),
            promoterAdress: `${promoterAddress}, ${promoterCountry}`,
            promoterPhone: this.get(formData, 'promoterInformation.phoneNumber'),
            promoterEmail: this.get(formData, 'promoterInformation.email'),

            artistName: artist.name,
            artistRealName: `${artistProfile.firstName} ${artistProfile.lastName}`,
            artistCountry: artistCountry,
            artistFee: ctx.booking.artistFee,
            performanceDuration,

            eventName: ctx.event.name,
            eventDate: EventUtil.dateString(ctx.event),
            // eventVenue: `${eventAddress}, ${eventCountry}`,

            // agencyName: managerData.agencyName,
            agencyCompanyName: managerData.agencyCompanyName,
            accountHolder: managerData.accountHolder,
            nameOfBank: managerData.nameOfBank,
            accountAddress: managerData.accountAddress,
            accountNumber: managerData.accountNumber,
            accountSwift: managerData.accountSwift,
            agencyEmail: managerData.agencyEmail,
            agencyPhone: managerData.agencyPhone,
            agencyFooterString: PaperUtil.agencyString(managerData),

            depositDeadline: Util.formatDate(BookingUtil.depositDeadline(ctx.event)),
            feeDeadline: Util.formatDate(BookingUtil.feeDeadline(ctx.event)),
        
            contractDate: Util.formatDate(now),
        }

    }

    private get(formData: any, path: string): any {
        return FormUtil.get(formData, path)
    }

}