import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { createAction, createReducer, createSelector, on, props, Store } from "@ngrx/store"
import { catchError, map, of, switchMap, tap, withLatestFrom } from "rxjs"
import { FormProcessorService } from "./form-processor.service"
import { AppState } from "../store/app.state"

export enum FormType {
    BOOKING = "BOOKING"
}

export interface Form {
    id: string
    formType: FormType
    data: any
}

export interface FormState {
    form: Form,
    started: boolean
    loading: boolean
    ready: boolean
    error?: Error
}



// SELECTORS

export const selectFormState = (state: AppState) => state.formState

export const loadingChange = createSelector(
    selectFormState,
    (state: FormState) => state.loading
)

export const dataChange = createSelector(
    selectFormState,
    (state: FormState) => state.form.data
)

export const selectFormId = createSelector(
    selectFormState,
    (state: FormState) => state.form.id
)


// ACTIONS

export const openForm = createAction("[FORM PROCESSOR] Open", props<{ formType: FormType }>())

export const openedForm = createAction("[FORM PROCESSOR] Opened", props<Form>())

export const newForm = createAction("[FORM PROCESSOR] New form")

export const startForm = createAction("[FORM PROCESSOR] Start", props<any>())

export const storeForm = createAction("[FORM PROCESSOR] Store", props<any>())

export const stopLoading = createAction("[FORM PROCESSOR] Stop loading")

export const setFormId = createAction("[FORM PROCESSOR] Set form id", props<{ id: string }>())

export const submitForm = createAction("[FORM PROCESSOR] Submit form", props<any>())


const initialState: FormState = {
    form: {
        id: '',
        formType: FormType.BOOKING,
        data: null
    },
    started: false,
    loading: false,
    ready: false,
}

export const formReducer = createReducer(
    initialState,
    on(openForm, (state, formType) => ({
        ...state,
        form: {
            ...state.form,
            formType: formType.formType
        },
        loading: true,
    })),
    
    on(newForm, (state) => ({
        ...state,
        loading: false,
        form: {
            ...state.form,
            id: '',
            data: null,
        }
    })),
    
    on(openedForm, (state, form) => ({
        ...state,
        loading: false,
        started: true,
        form: {
            ...form,
        }
    })),

    on(startForm, (state, data) => ({
        ...state,
        loading: true,
        started: true,
        form: {
            ...state.form,
            data
        }
    })),

    on(storeForm, (state, data) => ({
        ...state,
        loading: true,
        form: {
            ...state.form,
            data
        }
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

    on(submitForm, (state, data) => ({
        ...state,
        loading: true,
        ready: true,
        form: {
            ...state.form,
            data
        }
    }))
) 

@Injectable()
export class FormEffect {
    
    constructor(
        private actions$: Actions,
        private store: Store<AppState>, 
        private formProcessorService: FormProcessorService,
    ){}

    openForm$ = createEffect(() => this.actions$.pipe(
        ofType(openForm),
        switchMap(_ => this.store.select(store => store.formState.form.formType)),
        switchMap(type => {
            const id = localStorage.getItem(type)
            if (id) {
                return this.formProcessorService.openForm$(id)
                    .pipe(
                        map(form => openedForm(form)),
                        catchError(error => of(newForm()))
                    )
            } else {
                return of(newForm())
            }
        })
    ))

    startForm$ = createEffect(() => this.actions$.pipe(
        ofType(startForm),

        withLatestFrom(this.store.select(store => store.formState.form)),
        map(arr => arr[1]),

        switchMap(form => this.formProcessorService.startForm$(form)),
        map(id => setFormId(id))
    ))

    setFormId$ = createEffect(() => this.actions$.pipe(
        ofType(setFormId),
        map(_ => stopLoading())
    ))

    storeForm$ = createEffect(() => this.actions$.pipe(
        ofType(storeForm),
        withLatestFrom(this.store.select(store => store.formState.form)),
        map(arr => arr[1]),

        switchMap(form => this.formProcessorService.storeForm$(form)),
        catchError(error => of(stopLoading())),
        map(_ => stopLoading()),
    ))

    submitForm$ = createEffect(() => this.actions$.pipe(
        ofType(submitForm),
        withLatestFrom(this.store.select(store => store.formState.form)),
        map(arr => arr[1]),

        switchMap(form => this.formProcessorService.submitForm$(form)),
        catchError(error => of(stopLoading())),
        map(_ => stopLoading()),
    ))

}