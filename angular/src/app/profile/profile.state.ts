import { createAction, createReducer, createSelector, on, props } from "@ngrx/store"
import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { map, tap } from "rxjs"
import { Token } from "./auth/view/token"
import { selectProfileState } from "../app.state"
import { Profile } from "./profile.model"
import { DialogService } from "../global/nav/dialog.service"
import { NavService } from "../global/nav/nav.service"
import { HandSignature } from "./profile.service"
import { BookingDto } from "../booking/services/booking.service"

export interface ProfileState {
    loading: boolean
    loggedIn: boolean
    profile?: Profile
    uuid: string

    signature?: HandSignature
    bookings?: BookingDto[]
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


// ACTIONS

export const login = createAction("[PROFILE] login")

export const loggedIn = createAction("[PROFILE] logged in", props<{ token: string }>())

export const setProfile = createAction("[PROFILE] set profile", props<Profile>())

export const logout = createAction("[PROFILE] logout")



export const setHandSignature = createAction("[PROFILE] [SIGNATURE] set", props<HandSignature>())

export const remvoeHandSignature = createAction("[PROFILE] [SIGNATURE] remove")


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
)


@Injectable()
export class ProfileEffect {
    
    constructor(
        private actions$: Actions,
        private dialog: DialogService,
        private nav: NavService,
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

}