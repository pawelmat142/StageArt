import { createAction, createReducer, createSelector, on, props, Store } from "@ngrx/store";
import { ArtistViewDto } from "../../model/artist-view.dto";
import { AppState, selectArtistView } from "../../../app.state";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ArtistService } from "../../artist.service";
import { map, of, withLatestFrom } from "rxjs";
import { profileChange } from "../../../profile/profile.state";

export interface ArtistViewState {
    artist?: ArtistViewDto
    original?: ArtistViewDto
    loading: boolean
    editMode: boolean
    editable: boolean
    tempAvatar?: File 
    tempBgImage?: File
}


// SELECTORS

export const artistViewLoadingChange = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.loading
)

export const editable = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.editable
)

export const editMode = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.editMode
)

export const artist = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.artist
)

export const artistAvatar = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.tempAvatar
)

export const artistTempBgImage = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.tempBgImage
)


// ACTIONS

export const initializedArtist = createAction("[ArtistViewState] initialized", props<ArtistViewDto>())

export const canEdit = createAction("[ArtistViewState] check if can edit", props<{ canEdit: boolean }>())

export const startEditArtist = createAction("[ArtistViewState] start edit")

export const load = createAction("[ArtistViewState] loading")

export const selectAvatar = createAction("[ArtistViewState] select avatar", props<{ file: File }>())

export const addBgImage = createAction("[ArtistViewState] add background image", props<{ file: File }>())




export const uploadArtistChanges = createAction("[ArtistViewState] upload changes")

export const declineArtistChanges = createAction("[ArtistViewState] decline changes")


const initialState: ArtistViewState = {
    loading: false,
    editMode: true,
    // TODO mock
    // editMode: false,
    editable: false,
}

export const artistViewReducer = createReducer(
    initialState,

    on(initializedArtist, (state, artist) => ({
        ...state,
        loading: false,
        artist: artist
    })),

    on(canEdit, (state, canEdit) => ({
        ...state,
        editable: canEdit.canEdit
    })),

    on(startEditArtist, (state) => ({
        ...state,
        editMode: true,
        original:  state.artist,
    })),

    on(load, (state) => ({
        ...state,
        loading: true,
    })),

    on(selectAvatar, (state, avatar) => ({
        ...state,
        loading: false,
        tempAvatar: avatar.file
    })),

    on(addBgImage, (state, image) => ({
        ...state,
        loading: false,
        tempBgImage: image.file 
    }))
)


@Injectable()
export class ArtistViewEffect {
    
    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private artistService: ArtistService
    ){}

    initializedArtist$ = createEffect(() => this.actions$.pipe(
        ofType(initializedArtist),
        withLatestFrom(this.store.select(profileChange)),
        map(([artist, profile]) => {
            return canEdit({ canEdit: artist.signature === profile?.artistSignature })
        })
    ))

}