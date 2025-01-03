import { Injectable, Logger } from "@nestjs/common"
import { Profile } from "../../profile/model/profile.model"
import { BookingService } from "../../booking/services/booking.service"
import { Booking, BookingStatus } from "../../booking/model/booking.model"
import { DateUtil } from "../../global/utils/date.util"
import { FormService } from "../../form/form.service"
import { getBookForm } from "./book-forms"
import { COUNTRIES } from "./countries"
import { ArtistViewDto } from "../../artist/model/artist-view.dto"
import { Util } from "../../global/utils/util"
import { EventData } from "./event-data"
import { Gen } from "../gen.util"
import { Country } from "../../artist/model/artist.model"

@Injectable()
export class BookingsGenerator {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly bookingService: BookingService,
        private readonly formService: FormService,
    ) {}

    // INPUT
    private PROMOTERS: Profile[] = []
    private ARTISTS: ArtistViewDto[] = []

    // OUTPUT
    private BOOKINGS: Booking[] = []

    private boookingsIterator = 0

    _eventNames: string[] = []

    public async generate(PROMOTERS: Profile[], ARTISTS: ArtistViewDto[]): Promise<Booking[]> {
        this.logger.log(`[START] bookings generate`)
        this.PROMOTERS = PROMOTERS
        this.ARTISTS = ARTISTS

        await this.getneratePromoterZeroBookings()
        await this.getneratePromoterOneBookings()

        this.logger.log(`[STOP] bookings generate`)
        return this.BOOKINGS
    }



    private async getneratePromoterZeroBookings() {
        this.logger.log(`[START] promoter ZERO bookings generate`)
        const promoter = this.PROMOTERS[0]
        if (!promoter) {
            this.logger.log(`[SKIP] not found promoter ZERO`)
            return
        }
        this._eventNames = []
        const eventName = 'Sunset Reverie'
        const months1 = [ -22, -18, -10, -2, 4, 5, 7]
        for (let i = 0; i < months1.length; i++) {
            const addMonths = months1[i];
            const event = this.getEventInformation(`${eventName}`, COUNTRIES[6], addMonths, 1)
            const booking = await this.generateBooking(promoter, this.ARTISTS[0], event, 'READY')
        }
        const eventName1 = 'Into the Horizon'
        const months2 = [  -3, -2, -1, 0, 1, 2, 3]
        for (let i = 0; i < months2.length; i++) {
            const addMonths = months2[i];
            const event = this.getEventInformation(`${eventName1}`, COUNTRIES[5], addMonths, 1)
            const booking = await this.generateBooking(promoter, this.ARTISTS[8], event, 'READY')
        }
        await this.generateBooking(promoter, this.ARTISTS[1], this.getRandomEventInfo(7), 'DOCUMENTS')
        await this.generateBooking(promoter, this.ARTISTS[2], this.getRandomEventInfo(9), 'READY')

        await this.generateBooking(promoter, this.ARTISTS[3], this.getRandomEventInfo(-8), 'DOCUMENTS')
        await this.generateBooking(promoter, this.ARTISTS[3], this.getRandomEventInfo(-10), 'READY')
        await this.generateBooking(promoter, this.ARTISTS[3], this.getRandomEventInfo(-22), 'READY')
        this.logger.log(`[STOP] promoter ZERO bookings generate`)
    }

    private async getneratePromoterOneBookings() {
        this.logger.log(`[START] promoter ONE bookings generate`)
        const promoter = this.PROMOTERS[1]
        if (!promoter) {
            this.logger.log(`[SKIP] not found promoter ONE`)
            return
        }
        this._eventNames = []
        const eventName = 'Victory Anthem';
        const months = [ -6, -4, -2, 0, 2, 4]
        for (let i = 0; i < months.length; i++) {
            const addMonths = months[i];
            const event = this.getEventInformation(`${eventName}`, COUNTRIES[4], addMonths, 1)
            const booking = await this.generateBooking(promoter, this.ARTISTS[7], event, 'READY')
        }
        await this.generateBooking(promoter, this.ARTISTS[4], this.getRandomEventInfo(-1, -2), 'READY')
        await this.generateBooking(promoter, this.ARTISTS[4], this.getRandomEventInfo(-2), 'READY')
        await this.generateBooking(promoter, this.ARTISTS[4], this.getRandomEventInfo( -4, 2), 'SUBMITTED')
        await this.generateBooking(promoter, this.ARTISTS[4], this.getRandomEventInfo(-7), 'CHECKLIST_COMPLETE')
        await this.generateBooking(promoter, this.ARTISTS[5], this.getRandomEventInfo(3), 'DOCUMENTS')
        await this.generateBooking(promoter, this.ARTISTS[5], this.getRandomEventInfo(5, 1), 'SUBMITTED')
        await this.generateBooking(promoter, this.ARTISTS[5], this.getRandomEventInfo(7), 'CANCELED')
        await this.generateBooking(promoter, this.ARTISTS[5], this.getRandomEventInfo(14), 'CANCELED')
        this.logger.log(`[STOP] promoter ONE bookings generate`)
    }

    private getRandomEventInfo(startsAfterMonths: number, days?: number) {
        return this.getEventInformation(this.getEventName(), Gen.randomCountry(), startsAfterMonths, days)
    }

    private async generateBooking(promoter: Profile, artist: ArtistViewDto, event: any, status: BookingStatus): Promise<Booking> {
        const i = this.boookingsIterator++
        this.logger.log(`[START] ${i} Generate booking`)
        const promoterInformation = this.promoterInfoFromProfie(promoter, i)
        const eventInformation = event ? event : this.getRandomEventInfo(3+(2*i), 1)

        const start = new Date(eventInformation.performanceStartDate)

        const bookForm = getBookForm(
            { code: artist.signature, name: artist.name },
            promoterInformation,
            eventInformation
        );

        const { formId } = await this.formService.startForm('BOOKING', bookForm)
        const booking = await this.bookingService.submitForm(formId, Gen.toJwtProfile(promoter), { skipValidateDuplicate: true })

        const statusBefore = booking.status
        if (start < DateUtil.NOW ) {
            booking.status = 'READY'
        } else {
            booking.status = status
        }
        if (statusBefore !== booking.status) {
            await this.bookingService.update(booking)
        }
        this.logger.log(`Generated booking ${bookForm.eventInformation.eventName}`)
        this.BOOKINGS.push(booking)
        this.logger.log(`[STOP] ${i} Generate booking`)
        return booking
    }

    private _eventNamesIterator = 0

    private getEventName(name?: string): string {
        if (name) {
            return `${name}-${this._eventNamesIterator++}`
        }
        const eventName = EventData.getRandomEventName(this._eventNames)
        this._eventNames.push(eventName)
        return eventName
    }

    private promoterInfoFromProfie(promoter: Profile, index: number, companyNameSuffif = 'Sonic Creations'): any {
        const split = promoter.name.split(" ")
        const firstName = split[0]
        const lastName = split[1]
        const country = COUNTRIES[index + 1] || COUNTRIES[0]
        return {
            promoterFirstName: firstName,
            promoterLastName: lastName,
            companyName: `${promoter.name} ${companyNameSuffif}`,
            companyCountry: country,
            companyAddress: "Via delle Stelle, 22 City",
            companyVatNumber: "987654",
            email: `${Util.toKebabCase(promoter.name)}@test.com`,
            phoneNumber: "+39 334 567 8910",
            website: "",
            experienceInOrganizingEvents: "12",
            significantOrganizedPastEvents: ""
          }
    } 

    private getEventInformation(name: string, country: Country, startsAfterMonths: number, days?: number): any {
        const start = DateUtil.afterMonths(startsAfterMonths, -startsAfterMonths)
        const end = days? DateUtil.addDays(start, days) : undefined 
        return {
            performanceStartDate: start,
            performanceEndDate: end,
            eventName: name,
            eventCountry: country,
            venueName: "Piazza della Musica",
            venueAddress: "45, 20121 Milan",
            nearestAirport: "Milan Malpensa Airport",
            website: "www.electricpulsefestival.it",
            venueCapacity: "12000",
            ticketPrice: "120 euro",
            ageRestriction: "18",
            recentArtistsPerformedInVenue: "",
            videoLinkToRecentShow: "https://www.youtube.com/watch?v=TfZJaQQ9UYE"
        }
    } 

}