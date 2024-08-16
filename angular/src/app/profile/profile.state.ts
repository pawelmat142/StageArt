import { createAction, createReducer, createSelector, on, props, Store } from "@ngrx/store"
import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { tap, withLatestFrom } from "rxjs"
import { Token } from "./auth/view/token"
import { selectProfileState, AppState } from "../app.state"
import { Profile } from "./profile.model"

export interface ProfileState {
    loading: boolean
    loggedIn: boolean
    profile: Profile | null
    uuid: string
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

export const loggedInChange = createSelector(
    selectProfileState,
    (state: ProfileState) => state.loggedIn
)


// ACTIONS

export const login = createAction("[PROFILE] login")

export const loggedIn = createAction("[PROFILE] logged in", props<Profile>())

export const logout = createAction("[PROFILE] logout")


const initialState: ProfileState = {
    loading: false,
    loggedIn: false,
    uuid: '',
    profile: null
}

export const profileReducer = createReducer(
    initialState,
    on(login, (state) => ({
        ...state,
        loading: true
    })),

    on(loggedIn, (state, profile) => ({
        ...state,
        loggedIn: true,
        loading: false,
        profile: profile
    })),

    on(logout, (state) => ({
        ...state,
        loggedIn: false,
        loading: false,
        profile: null,
    })),

)


@Injectable()
export class ProfileEffect {
    
    constructor(
        private actions$: Actions,
        private store: Store<AppState>, 
    ){}

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(logout),
        tap(() => Token.remove()),
    ), { dispatch: false })

}