import { ArtistsState } from "./artist/artists.state"
import { FormState } from "./form-processor/form.state"
import { ProfileState } from "./profile/profile.state"

export interface AppState {
    artistsState: ArtistsState
    formState: FormState
    profileState: ProfileState
}

export const selectForm = (state: AppState) => state.formState

export const selectArtistsState = (state: AppState) => state.artistsState

export const selectProfileState = (state: AppState) => state.profileState