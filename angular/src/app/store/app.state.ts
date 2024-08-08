import { ArtistsState } from "./artist/artists.state"
import { BookingFormState } from "./booking-form/booking-form.state"

export interface AppState {
    artists: ArtistsState
    bookingForm: BookingFormState
}

export const selectBookingForm = (state: AppState) => state.bookingForm

export const selectArtists = (state: AppState) => state.artists