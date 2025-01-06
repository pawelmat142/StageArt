import { createAction, createReducer, createSelector, on, props, Store } from '@ngrx/store';
import { ArtistViewDto } from './model/artist-view.dto';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ArtistService } from './artist.service';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { AppState, selectArtistsState } from '../app.state';
import { OFFLINE_MODE } from '../app.component';

export interface ArtistsState {
    artists: ArtistViewDto[]
    loading: boolean
    initialized: boolean
    error?: Error
}

enum ArtistsAction {
    INIT_ARTISTS = "Init Artists",
    ARTISTS_INITIALIZED = "Artists initialized",
    FETCH_ARTISTS = "Fetch artists",
    FETCH_ARTISTS_SUCCESS = "Fetch artists success",
    FETCH_ARTISTS_FAILED = "Fetch artists failed",
    CLEAN_ARTISTS = "Clean artists"
}

export const initArtists = createAction(ArtistsAction.INIT_ARTISTS)

export const artistsInitialized = createAction(ArtistsAction.ARTISTS_INITIALIZED)

export const fetchArtists = createAction(ArtistsAction.FETCH_ARTISTS)

export const fetchArtistsSuccess = createAction(ArtistsAction.FETCH_ARTISTS_SUCCESS, props<{ artists: ArtistViewDto[] }>())

export const fetchArtistsFail = createAction(ArtistsAction.FETCH_ARTISTS_FAILED, props<Error>())

export const cleanArtists = createAction(ArtistsAction.CLEAN_ARTISTS)


export const selectArtists = (state: AppState) => state.artistsState.artists

export const loadingChange = createSelector(
    selectArtistsState,
    (state: ArtistsState) => state.artists
)

const initialState: ArtistsState = {
    artists: [],
    loading: false,
    initialized: false
}

export const artistsReducer = createReducer(
    initialState,
    on(fetchArtists, (state) => ({
        ...state,
        loading: true
    })),
    on(fetchArtistsSuccess, (state, { artists }) => ({
        ...state,
        loading: false,
        initialized: true,
        artists: artists
    })),
    on(fetchArtistsFail, (state, error) => ({
        ...state,
        error: error
    })),
    on(cleanArtists, (state) => ({
        ...state,
        initialized: false,
        loading: false,
        artists: []
    }))
)

@Injectable()
export class ArtistEffect {

    constructor(
        private actions$: Actions,
        private artistService: ArtistService, 
        private store: Store<AppState>, 
    ){}

    initArtists$ = createEffect(() => this.actions$.pipe(
        ofType(initArtists),
        filter(() => !OFFLINE_MODE),
        withLatestFrom(this.store.select(selectArtistsState).pipe(map(state => state.initialized))),
        map(arr => arr[1]),
        switchMap(initialized => {
            if (initialized) {
                return of(artistsInitialized())
            }
            return of(fetchArtists())
        })
    ))

    fetchArtists$ = createEffect(() => this.actions$.pipe(
        ofType(fetchArtists),
        switchMap(() => this.artistService.fetchArtists$()),
        map(artists => fetchArtistsSuccess({ artists })),
        catchError(error => of(fetchArtistsFail(error)))
    ))

}

