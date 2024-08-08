import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { createAction, createReducer, on, props, Store } from "@ngrx/store"
import {  catchError, filter, map, of, switchMap, tap, withLatestFrom } from "rxjs"
import { BookingForm } from "./booking-form.model"
import { BookingFormService } from "./booking-form.service"

export interface BookingFormState {
    form: BookingForm
    started: boolean
    loading: boolean
    ready: boolean
    error?: Error
}

export const openForm = createAction("[BOOKING FORM] Open")

export const openedForm = createAction("[BOOKING FORM] Opened", props<BookingForm>())

export const startForm = createAction("[BOOKING FORM] Start", props<BookingForm>())

export const storeForm = createAction("[BOOKING FORM] Store", props<BookingForm>())

export const stopLoading = createAction("[BOOKING FORM] Stop loading")

export const setFormId = createAction("[BOOKING FORM] Set form id", props<{ id: string }>())



const initialState: BookingFormState = {
    form: { id: '' },
    started: false,
    loading: false,
    ready: false,
}

export const bookingFormReducer = createReducer(
    initialState,
    
    on(openForm, (state) => ({
        ...state,
        loading: true,
    })),
    
    on(openedForm, (state, form) => ({
        ...state,
        loading: false,
        started: true,
        form: form
    })),

    on(startForm, (state, form) => ({
        ...state,
        loading: true,
        started: true,
        form: form
    })),

    on(storeForm, (state, form) => ({
        ...state,
        loading: true,
        form: form
    })),

    on(stopLoading, (state) => ({
        ...state,
        loading: false,
    })),

    on(setFormId, (state, id) => ({
        ...state,
        form: {
            ...state.form,
            id: id.id
        }
    })),

)


@Injectable()
export class BookingFormEffect {
    
    constructor(
        private actions$: Actions,
        private bookingFormService: BookingFormService,
        private store: Store<{ bookingForm: BookingFormState }>, 
    ){}

    openForm$ = createEffect(() => this.actions$.pipe(
        ofType(openForm),
        map(_ => localStorage.getItem(BookingFormService.LOCAL_STORAGE_KEY)),
        tap((id) => {
            console.log('id:')
            console.log(id)
        }),
        
        filter(id => !!id),
        switchMap(id => this.bookingFormService.openForm$(id!)),
        tap(form => {
            console.log('form')
            console.log(form)
        }),
        map(form => openedForm(form))
    ))

    startForm$ = createEffect(() => this.actions$.pipe(
        ofType(startForm),
        withLatestFrom(this.store.select(store => store.bookingForm.form)),
        map(arr => arr[1]),
        switchMap(form => this.bookingFormService.startForm$(form)),
        map(id => setFormId(id))
    ))

    setFormId$ = createEffect(() => this.actions$.pipe(
        ofType(setFormId),
        switchMap(_ => of(stopLoading()))
    ))

    storeForm$ = createEffect(() => this.actions$.pipe(
        ofType(storeForm),
        withLatestFrom(this.store.select(store => store.bookingForm.form)),
        map(arr => arr[1]),
        switchMap(form => this.bookingFormService.storeForm$(form, form.id)),
        catchError(error => of(stopLoading())),
        switchMap(_ => of(stopLoading())),
    ))

}
