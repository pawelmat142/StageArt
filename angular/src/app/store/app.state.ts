import { ProfileState } from "../auth/profile.state"
import { FormState } from "../form-processor/form.state"
import { ArtistsState } from "./artist/artists.state"

export interface AppState {
    artists: ArtistsState
    formState: FormState
    profileState: ProfileState
}

export const selectForm = (state: AppState) => state.formState

export const selectArtists = (state: AppState) => state.artists.artists

export const selectProfile = (state: AppState) => state.profileState