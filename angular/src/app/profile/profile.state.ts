import { createAction, createReducer, createSelector, on, props } from "@ngrx/store"
import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { map, switchMap, tap } from "rxjs"
import { Token } from "./auth/view/token"
import { selectProfileState } from "../app.state"
import { Profile } from "./profile.model"
import { DialogService } from "../global/nav/dialog.service"
import { NavService } from "../global/nav/nav.service"
import { HandSignature } from "./profile.service"
import { BookingDto, BookingService } from "../booking/services/booking.service"

export interface ProfileState {
    loading: boolean
    loggedIn: boolean
    profile?: Profile
    uuid: string

    signature?: HandSignature
    bookings?: BookingDto[]
    singleBooking?: BookingDto
    formData?: any
}


// SELECTORS
export const profileLoadingChange = createSelector(
    selectProfileState,
    (state: ProfileState) => state.loading
)

export const profile = createSelector(
    selectProfileState,
    (state: ProfileState) => state.profile
)

export const uid = createSelector(
    selectProfileState,
    (state: ProfileState) => state.profile?.uid
)

export const profileName = createSelector(
    selectProfileState,
    (state: ProfileState) => state.profile?.name
)

export const loggedInChange = createSelector(
    selectProfileState,
    (state: ProfileState) => state.loggedIn
)

export const handSignature = createSelector(
    selectProfileState,
    (state: ProfileState) => state.signature
)




export const profileBookings = createSelector(
    selectProfileState,
    (state: ProfileState) => state.bookings
)

export const profileSingleBooking = createSelector(
    selectProfileState,
    (state: ProfileState) => state.singleBooking
)

export const bookingFormData = createSelector(
    selectProfileState,
    (state: ProfileState) => state.formData
)


// ACTIONS

export const login = createAction("[PROFILE] login")

export const loggedIn = createAction("[PROFILE] logged in", props<{ token: string }>())

export const setProfile = createAction("[PROFILE] set profile", props<Profile>())

export const logout = createAction("[PROFILE] logout")


export const setHandSignature = createAction("[PROFILE] [SIGNATURE] set", props<HandSignature>())
export const remvoeHandSignature = createAction("[PROFILE] [SIGNATURE] remove")

export const loadBookings = createAction("[PROFILE] [BOOKINGS] init")
export const setBookings = createAction("[PROFILE] [BOOKINGS] set", props<{ value: BookingDto[] }>())

export const selectBooking = createAction("[PROFILE] [BOOKINGS] select", props<BookingDto>())
export const unselectBooking = createAction("[PROFILE] [BOOKINGS] unselect")

export const updateBooking = createAction("[PROFILE] [BOOKINGS] update", props<BookingDto>())


export const setBookingFormData = createAction("[PROFILE] [formData] set", props<any>())
export const removeBookingFormData = createAction("[PROFILE] [formData] remove")


const initialState: ProfileState = {
    loading: false,
    loggedIn: false,
    uuid: '',
    profile: undefined
}

export const profileReducer = createReducer(
    initialState,

    on(login, (state) => ({
        ...state,
        loading: true
    })),

    on(loggedIn, (state) => ({
        ...state,
    })),

    on(setProfile, (state, profile) => ({
        ...state,
        loggedIn: true,
        loading: false,
        profile: profile
    })),

    on(logout, (state) => ({
        ...state,
        loggedIn: false,
        loading: false,
        profile: undefined,
    })),

    on(setHandSignature, (state, handSignature) => ({
        ...state,
        signature: handSignature
    })),

    on(remvoeHandSignature, (state) => ({
        ...state,
        signature: undefined
    })),



    on(loadBookings, (state) => ({
        ...state,
        loading: true
    })),

    on(setBookings, (state, bookings) => ({
        ...state,
        loading: false,
        bookings: bookings.value
    })),


    on(selectBooking, (state, booking) => ({
        ...state,
        loading: false,
        singleBooking: booking
    })),

    on(unselectBooking, (state) => ({
        ...state,
        loading: false,
        singleBooking: undefined
    })),


    on(updateBooking, (state, booking) => {
        const bookings = state.bookings?.map(b => booking.formId === b.formId ? booking : b)
        return {
            ...state,
            bookings
        }
    }),

    on(setBookingFormData, (state, formData) => ({
        ...state,
        formData
    })),

    on(removeBookingFormData, (state) => ({
        ...state,
        formData: undefined
    })),
)


@Injectable()
export class ProfileEffect {
    
    constructor(
        private actions$: Actions,
        private dialog: DialogService,
        private nav: NavService,
        private bookingService: BookingService,
    ){}

    loggedIn$ = createEffect(() => this.actions$.pipe(
        ofType(loggedIn),
        map((token) => {
            Token.set(token.token)
            const profile = Token.payload
            return profile ? setProfile(profile) : logout()
        }),
    ))

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(logout),
        tap(() => {
            Token.remove()
            if (!this.nav.isHome) {
                this.nav.home()
                this.dialog.simplePopup('Logged out')
            }
        }),
    ), { dispatch: false })




    loadBookings$ = createEffect(() => this.actions$.pipe(
        ofType(loadBookings),
        switchMap(() => this.bookingService.fetchProfileBookings$()),
        tap(console.log),
        map(bookings => setBookings({ value: bookings }))
    ))

}