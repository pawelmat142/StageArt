import { BookingContext } from "../../booking/services/booking.service"
import { EventUtil } from "../../event/event-util";
import { IllegalStateException } from "../../global/exceptions/illegal-state.exception";
import { Template } from "../doc-util"
import * as fs from 'fs';
import * as path from 'path';
import { Util } from "../../global/utils/util";
import { BookingUtil } from "../../booking/util/booking.util";
import Handlebars from "handlebars";

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

export class BookingContractGenerator {

    private readonly template: Template = 'contract'

    constructor(private ctx: BookingContext) {}

    data?: BookingContractDocumentData

    generate(): string {
        this.prepareData()
        const template = this.getTemplate()
        const document = this.fillTemplateData(template)
        return document
    }

    private prepareData() {
        const formData = this.ctx.booking.formData
        if (!formData) {
            throw new IllegalStateException('Missing form data')
        }
        const now = new Date()

        const eventCountry = this.get(formData, 'eventInformation.eventCountry') //TODO country name - not code here,
        const eventAddress = this.get(formData, 'eventInformation.venueAddress')

        this.data = {
            year: now.getFullYear().toString(),
            promoterName: this.get(formData, 'promoterInformation.promoterName'),
            promoterCompanyName: this.get(formData, 'promoterInformation.companyName'),
            promoterAdress: this.get(formData, 'promoterInformation.companyAddress'),
            promoterPhone: this.get(formData, 'promoterInformation.phoneNumber'),
            promoterEmail: this.get(formData, 'promoterInformation.email'),

            artistName: this.ctx.artist.name,
            artistRealName: `${this.ctx.artist.firstName} ${this.ctx.artist.lastName}`,
            artistPerformance: `???`,//TODO
            artistCountry: this.ctx.artist.countryCode, //TODO country name - not code here,
            artistFee: '??', // TODO skad to?

            eventName: this.ctx.event.name,
            eventDate: EventUtil.dateString(this.ctx.event),
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

            depositDeadline: Util.formatDate(BookingUtil.depositDeadline(this.ctx.event)),
            feeDeadline: Util.formatDate(BookingUtil.feeDeadline(this.ctx.event)),
        
            contractDate: Util.formatDate(now)
        }
    }

    private getTemplate(): string {
        const templateFileName = `${this.template}-template.html`
        const templatePath = path.join(__dirname, '..', 'templates', templateFileName)
        let template = fs.readFileSync(templatePath, 'utf8');
        if (!template) {
            throw new IllegalStateException(`Template loading error`)
        }
        return template
    }

    private fillTemplateData(template: string): string {
        const templateToFill = Handlebars.compile(template);
        const filledTemplate = templateToFill(this.data)
        return filledTemplate
    }

    private get(obj: any, path: string): any {
        const properties = path.split('.');
        let current: any = obj;
    
        for (const prop of properties) {
            if (current == null || !current.hasOwnProperty(prop)) {
                throw new IllegalStateException(`Property "${prop}" is missing in path "${path}"`);
            }
            current = current[prop];
        }
    
        return current;
    }
}