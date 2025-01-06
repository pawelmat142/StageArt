import { ArtistsState } from "./artist/artists.state"
import { ArtistViewState } from "./artist/view/artist-view/artist-view.state"
import { FormState } from "./form-processor/form.state"
import { ProfileState } from "./profile/profile.state"

export interface AppState {
    artistsState: ArtistsState
    formState: FormState
    profileState: ProfileState
    artistViewState: ArtistViewState
}

export const selectForm = (state: AppState) => state.formState
    
export const selectArtistsState = (state: AppState) => state.artistsState

export const selectProfileState = (state: AppState) => state.profileState

export const selectArtistView = (state: AppState) => state.artistViewState