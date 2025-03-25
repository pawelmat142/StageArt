import { Artist } from "../../artist/model/artist.model"
import { Event } from "../../event/model/event.model"
import { JwtPayload } from "../../profile/auth/jwt-strategy"
import { Booking } from "./booking.model"

export interface SimpleBookingContext {
    profile: JwtPayload
    booking: Booking
}

export interface BookingContext extends SimpleBookingContext {
    event: Event
    artists: Artist[]
}

export interface DocumentsStepRequest {
    formId: string,
    artistFee: string 
}