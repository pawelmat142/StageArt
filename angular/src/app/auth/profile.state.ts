import { createAction, createReducer, createSelector, on, props, Store } from "@ngrx/store"
import { AppState, selectProfileState } from "../store/app.state"
import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { tap } from "rxjs"
import { Token } from "./token"

export type Role = 'MANAGER' | 'PROMOTER' | 'ARTIST' | 'ADMIN'

export interface Profile { // JwtPayload
    uid: string
    name: string
    telegramChannelId: string
    role: Role
    exp: number
    iat: number
}

export interface ProfileState {
    loading: boolean
    loggedIn: boolean
    profile: Profile | null
    uuid: string
}


// ACTIONS

export const login = createAction("[PROFILE] login")

export const loggedIn = createAction("[PROFILE] logged in", props<Profile>())

export const logout = createAction("[PROFILE] logout")


export const profileLoadingChange = createSelector(
    selectProfileState,
    (state: ProfileState) => state.loading
)

export const profileChange = createSelector(
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
    }))

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