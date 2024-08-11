import { createAction, createReducer, createSelector, on, props } from "@ngrx/store"
import { selectProfile } from "../store/app.state"

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
    selectProfile,
    (state: ProfileState) => state.loading
)

export const profileChange = createSelector(
    selectProfile,
    (state: ProfileState) => state.profile
)

export const loggedInChange = createSelector(
    selectProfile,
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
