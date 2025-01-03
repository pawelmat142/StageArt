import { Injectable, Logger } from "@nestjs/common"
import { Profile } from "../../profile/model/profile.model"
import { JwtPayload } from "../../profile/auth/jwt-strategy"
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

@Injectable()
export class BookingsGenerator {

    private readonly logger = new Logger(this.constructor.name)

    private readonly now = new Date()

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
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', -22, 1, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', -18, undefined, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', -10, 2, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', -2, undefined, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', 4, undefined, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', 5, 2, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', 7, undefined, eventName))

        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[1], 'DOCUMENTS', 7))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[2], 'READY', 9))

        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[3], 'DOCUMENTS', -8))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[3], 'READY', -16))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[3], 'READY', -32))
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
        const eventName = 'Victory Anthem'
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', -6, undefined, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', -4, undefined, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', -2, undefined, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', 0, undefined, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', -2, undefined, eventName))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[0], 'READY', -4, undefined, eventName))

        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[4], 'READY', -1, 2))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[4], 'READY', -2))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[4], 'SUBMITTED', -4, 2))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[4], 'CHECKLIST_COMPLETE', -7))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[5], 'DOCUMENTS', 3))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[5], 'SUBMITTED', 5, 1))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[5], 'CANCELED', 7, 2))
        this.BOOKINGS.push(await this.generateBooking(promoter, this.ARTISTS[5], 'CANCELED', 14))
        this.logger.log(`[STOP] promoter ONE bookings generate`)
    }

    private async generateBooking(promoter: Profile, artist: ArtistViewDto, status: BookingStatus, startsAfterMonths: number, days?: number, name?: string): Promise<Booking> {
        const start = DateUtil.afterMonths(startsAfterMonths, -startsAfterMonths)
        const end = days? DateUtil.addDays(start, days) : undefined 

        const i = this.boookingsIterator++
        const eventCountry = COUNTRIES[i]

        const promoterInformation = this.promoterInfoFromProfie(promoter, i)

        const eventName = this.getEventName(name)
        console.log(eventName)

        const bookForm = getBookForm(
            eventName,
            eventCountry,
            { code: artist.signature, name: artist.name },
            promoterInformation,
            start,
            end
        );

        const { formId } = await this.formService.startForm('BOOKING', bookForm)
        const booking = await this.bookingService.submitForm(formId, Gen.toJwtProfile(promoter), { skipEventSearch: true })

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

}