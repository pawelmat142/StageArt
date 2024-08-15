import { createAction, createReducer, createSelector, on, props, Store } from "@ngrx/store";
import { ArtistViewDto } from "../../model/artist-view.dto";
import { AppState, selectArtistView } from "../../../app.state";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ArtistService } from "../../artist.service";
import { catchError, filter, forkJoin, map, noop, of, switchMap, tap, withLatestFrom } from "rxjs";
import { profileChange } from "../../../profile/profile.state";
import { FireImgStorageService } from "../../../global/services/fire-img-storage.service";
import { ImgSize, ImgUtil } from "../../../global/utils/img.util";
import { DialogService } from "../../../global/nav/dialog.service";
import { Images } from "../../model/artist-form";

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

export const cancelArtistChanges = createAction("[ArtistViewState] cancel changes")

export const saveChanges = createAction("[ArtistViewState] save changes")

export const artistSaved = createAction("[ArtistViewState] saved", props<ArtistViewDto>())


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
        editMode: false,
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
    })),

    on(cancelArtistChanges, (state) => ({
        ...state,
        editMode: false,
        artist: undefined,
        original: undefined,
        tempAvatar: undefined,
        tempBgImage: undefined,
    })),

    on(saveChanges, (state) => ({
        ...state,
        loading: true
    })),

    on(artistSaved, (state, artist) => ({
        ...state,
        loading: false,
        editMode: false,
        artist: artist,
        original: undefined,
        tempAvatar: undefined,
        tempBgImage: undefined,
    })),
)


@Injectable()
export class ArtistViewEffect {
    
    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<AppState>,
        private readonly artistService: ArtistService,
        private readonly dialog: DialogService,
        private readonly fireImgStorageService: FireImgStorageService,

    ){}

    initializedArtist$ = createEffect(() => this.actions$.pipe(
        ofType(initializedArtist),
        withLatestFrom(this.store.select(profileChange)),
        map(([artist, profile]) => {
            return canEdit({ canEdit: artist.signature === profile?.artistSignature })
        })
    ))

    saveChanges$ = createEffect(() => this.actions$.pipe(
        ofType(saveChanges),
        switchMap(() => this.fireImgUploads$()),
        catchError(error => this.handleUploadImagesError(error)),
        filter(fireImgs => !!fireImgs),
        map(fireImgs => ImgUtil.prepareImages(fireImgs)),
        withLatestFrom(this.store.select(artist)),
        map(([images, artist]) => this.setImages(images, artist)),
        switchMap(artist => this.artistService.updateArtistView$(artist).pipe(
            map(artist => artistSaved(artist)),
            catchError((error) => {
                this.dialog.errorPopup(error)
                return of(cancelArtistChanges())
            }),
            tap(_ => this.dialog.simplePopup('Saved changes')),
        )),
    ))

    private setImages(_images: Images, _artist?: ArtistViewDto): ArtistViewDto {
        const images: Images = {
            ..._images,
            avatar: _images.avatar || _artist?.images.avatar,
            bg: _images.bg?.length ? _images.bg : _artist?.images?.bg
        }
        const artist: ArtistViewDto = {
            ..._artist!,
            images: images
        }
        return artist as ArtistViewDto
    }

    private fireImgUploads$() {
        return this.store.select(selectArtistView).pipe(
            switchMap(state => {
                const uploads = []
                if (state.tempAvatar) {
                    uploads.push(this.fireImgStorageService.createFireImgSet$(state.tempAvatar, 
                        `artist/${state.artist?.signature}/avatar`, 
                        [ImgSize.avatar, ImgSize.mini]
                    ))
                }
                if (state.tempBgImage) {
                    uploads.push(this.fireImgStorageService.createFireImgSet$(state.tempBgImage, 
                        `artist/${state.artist?.signature}/bg-0`, 
                        [ImgSize.bg, ImgSize.miniBg, ImgSize.avatar]
                    ))
                }
                return forkJoin(uploads)
            })
        )
    }

    private handleUploadImagesError = (error: any) => {
        this.dialog.errorPopup(`Error uploading images`)
        console.error(error)
        // TODO popup
        return of(undefined)
      }

}