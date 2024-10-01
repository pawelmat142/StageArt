import { createAction, createReducer, createSelector, on, props, Store } from "@ngrx/store";
import { ArtistLabel, ArtistStyle, ArtistViewDto, FetchArtistQuery } from "../../model/artist-view.dto";
import { AppState, selectArtistView } from "../../../app.state";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ArtistService } from "../../artist.service";
import { catchError, forkJoin, map, Observable, of, switchMap, take, tap, withLatestFrom } from "rxjs";
import { FireImgStorageService } from "../../../global/services/fire-img-storage.service";
import { ImgSize, ImgUtil } from "../../../global/utils/img.util";
import { Dialog } from "../../../global/nav/dialog.service";
import { Images } from "../../model/artist-form";
import { ArtistMedia } from "../../artist-medias/artist-medias.service";
import { NavService } from "../../../global/nav/nav.service";
import { Country } from "../../../global/countries/country.model";

export interface ArtistViewState {
    artist?: ArtistViewDto
    original?: ArtistViewDto
    loading: boolean
    editMode: boolean
    profileIsOwner: boolean
    tempAvatar?: File 
    tempBgImage?: File
}


// SELECTORS

export const artistViewLoadingChange = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.loading
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

export const artistBio = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.artist?.bio
)

export const artistName = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.artist?.name
)

export const artistCountry = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.artist?.country
)

export const artistMedias = createSelector(
    selectArtistView,
    (state: ArtistViewState) => state.artist?.medias
)



// ACTIONS

export const initArtist = createAction("[ArtistViewState] init", props<FetchArtistQuery>())

export const initializedArtist = createAction("[ArtistViewState] initialized", props<ArtistViewDto>())

export const startEditArtist = createAction("[ArtistViewState] start edit")

export const loadingArtistView = createAction("[ArtistViewState] loading")

export const stopLoading = createAction("[ArtistViewState] stop loading")

export const selectAvatar = createAction("[ArtistViewState] select avatar", props<{ file: File }>())

export const addBgImage = createAction("[ArtistViewState] add background image", props<{ file: File }>())

export const updateBio = createAction("[ArtistViewState] update bio", props<{ value: string }>())

export const updateName = createAction("[ArtistViewState] update name", props<{ value: string }>())

export const updateCountry = createAction("[ArtistViewState] update country", props<{ value: Country }>())

export const updateMedias = createAction("[ArtistViewState] update medias", props<{ value: ArtistMedia[] }>())

export const updateStyle = createAction("[ArtistViewState] update style", props<{ value: ArtistStyle[] }>())

export const updateLabels = createAction("[ArtistViewState] update labels", props<{ value: ArtistLabel[] }>())

export const uploadArtistChanges = createAction("[ArtistViewState] upload changes")

export const cancelArtistChanges = createAction("[ArtistViewState] cancel changes")

export const saveChanges = createAction("[ArtistViewState] save changes")

export const artistSaved = createAction("[ArtistViewState] saved", props<ArtistViewDto>())


const initialState: ArtistViewState = {
    loading: false,
    editMode: false,
    profileIsOwner: false,
}

export const artistViewReducer = createReducer(
    initialState,

    on(initArtist, (state, query) => ({
        ...state,
        loading: true,
    })),

    on(loadingArtistView, (state) => ({
        ...state,
        loading: true,
    })),

    on(stopLoading, (state) => ({
        ...state,
        loading: false,
    })),

    on(initializedArtist, (state, artist) => ({
        ...state,
        loading: false,
        editMode: false,
        artist: artist
    })),

    on(startEditArtist, (state) => ({
        ...state,
        editMode: true,
        original:  state.artist,
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

    on(updateBio, (state, value) => {
        if (state.artist) {
            return {
                ...state,
                artist: {
                    ...state.artist,
                    bio: value.value
                }
            }
        } else {
            return state
        }
    }),

    on(updateName, (state, value) => {
        if (state.artist) {
            return {
                ...state,
                artist: {
                    ...state.artist,
                    name: value.value
                }
            }
        } else {
            return state
        }
    }),

    on(updateCountry, (state, value) => {
        if (state.artist) {
            return {
                ...state,
                artist: {
                    ...state.artist,
                    country: value.value
                }
            }
        } else {
            return state
        }
    }),

    on(updateMedias, (state, medias) => {
        if (state.artist) {
            return {
                ...state,
                artist: {
                    ...state.artist,
                    medias: medias.value
                }
            }
        } else {
            return state
        }
    }),

    on(updateStyle, (state, styles) => {
        if (state.artist) {
            return {
                ...state,
                artist: {
                    ...state.artist,
                    styles: styles.value
                }
            }
        } else {
            return state
        }
    }),

    on(updateLabels, (state, labels) => {
        if (state.artist) {
            return {
                ...state,
                artist: {
                    ...state.artist,
                    labels: labels.value
                }
            }
        } else {
            return state
        }
    }),

    on(cancelArtistChanges, (state) => ({
        ...state,
        editMode: false,
        artist: state.original,
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
        private readonly dialog: Dialog,
        private readonly fireImgStorageService: FireImgStorageService,
        private nav: NavService,
    ){}

    initArtist$ = createEffect(() => this.actions$.pipe(
        ofType(initArtist),
        withLatestFrom(this.store.select(artist).pipe(take(1))),
        switchMap(([query, artist]) => {
            if (artist && artist?.name === query.name) {
                return of(stopLoading())
            } else {
                return this.artistService.fetchArtist$(query).pipe(
                    take(1),
                    map(artist => initializedArtist(artist))
                )
            }
        }),
    ))

    saveChanges$ = createEffect(() => this.actions$.pipe(
        ofType(saveChanges),
        switchMap(() => this.uploadImagesIfNeeded$()),
        switchMap(state => this.artistService.updateArtistView$(state.artist!).pipe(
            tap(newArtist => {
                if (state.original?.name !== newArtist.name) {
                    this.nav.replaceUrl(`/artist/${newArtist.name}`)
                }
            }),
            map(artist => artistSaved(artist)),
            catchError((error) => {
                this.dialog.errorPopup(error)
                return of(cancelArtistChanges())
            }),
            tap(_ => this.dialog.simplePopup('Saved changes')),
        )),
    ))

    private uploadImagesIfNeeded$(): Observable<ArtistViewState> {
        return this.store.select(selectArtistView).pipe(
            take(1),
            switchMap(state => {
                const artist = state.artist!
                const uploads = []
                if (state.tempAvatar) {
                    uploads.push(this.fireImgStorageService.createFireImgSet$(state.tempAvatar, 
                        `artist/${state.artist?.signature}/avatar`, 
                        [ImgSize.avatar, ImgSize.avatarMobile, ImgSize.mini]
                    ))
                }
                if (state.tempBgImage) {
                    uploads.push(this.fireImgStorageService.createFireImgSet$(state.tempBgImage, 
                        `artist/${state.artist?.signature}/bg-0`,
                        [ImgSize.bg, ImgSize.bgMobile, ImgSize.avatar]
                    ))
                }
                if (uploads.length) {
                    return forkJoin(uploads).pipe(
                        catchError(error => this.handleUploadImagesError(error)),
                        map(imgSets => {
                            if (imgSets?.length) {
                                const images = ImgUtil.prepareImages(imgSets)
                                return {
                                    ...state,
                                    artist: this.setImages(images, artist)
                                }
                            }
                            return state
                        })
                    )
                }
                return of(state)
            })
        )
    }

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

    private handleUploadImagesError = (error: any) => {
        this.dialog.errorPopup(`Error uploading images`)
        console.error(error)
        // TODO popup
        return of(undefined)
      }

}