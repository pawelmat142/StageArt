import { Injectable } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import { createAction, createReducer, createSelector, on, props, Store } from "@ngrx/store"
import { catchError, forkJoin, map, of, switchMap, take, tap, withLatestFrom } from "rxjs"
import { FormProcessorService } from "./form-processor.service"
import { AppState } from "../app.state"
import { BookingService } from "../booking/services/booking.service"
import { EventService } from "../event/services/event.service"
import { EventsFormDataComponent } from "../global/nav/dialogs/events-form-data/events-form-data.component"
import { Dialog } from "../global/nav/dialog.service"

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

export const formLoadingChange = createSelector(
    selectFormState,
    (state: FormState) => state.loading
)

export const formData = createSelector(
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

export const setFormData = createAction("[FORM PROCESSOR] Set data", props<any>())

export const startForm = createAction("[FORM PROCESSOR] Start", props<any>())

export const storeForm = createAction("[FORM PROCESSOR] Store", props<any>())

export const stopFormLoading = createAction("[FORM PROCESSOR] Stop loading")

export const setFormId = createAction("[FORM PROCESSOR] Set form id", props<{ id: string }>())

export const submittedForm = createAction("[FORM PROCESSOR] Submitted form")


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
        ready: false,
        form: {
            ...state.form,
            id: '',
            data: null,
        }
    })),
    
    on(setFormData, (state, formData) => ({
        ...state,
        form: {
            ...state.form,
            data: formData,
        }
    })),
    
    on(openedForm, (state, form) => ({
        ...state,
        loading: false,
        started: true,
        ready: false,
        form: {
            ...form,
        }
    })),

    on(startForm, (state, data) => ({
        ...state,
        loading: true,
        started: true,
        ready: false,
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

    on(stopFormLoading, (state) => ({
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

    on(submittedForm, (state) => ({
        ...state,
        started: false,
        loading: false,
        ready: true,
        form: initialState.form,
    }))
) 

@Injectable()
export class FormEffect {
    
    constructor(
        private actions$: Actions,
        private store: Store<AppState>, 
        private formProcessorService: FormProcessorService,

        private readonly bookingService: BookingService,
        private readonly eventService: EventService,
        private readonly dialog: Dialog,
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
        map(_ => stopFormLoading())
    ))

    storeForm$ = createEffect(() => this.actions$.pipe(
        ofType(storeForm),
        withLatestFrom(this.store.select(store => store.formState.form)),
        map(arr => arr[1]),

        switchMap(form => this.formProcessorService.storeForm$(form)),
        catchError(error => of(stopFormLoading())),
        map(_ => stopFormLoading()),
    ))


    newForm$ = createEffect(() => this.actions$.pipe(
        ofType(newForm),
        switchMap(_ => this.store.select(store => store.formState.form.formType)),
        tap(formType => localStorage.removeItem(formType)),
        tap(formType => {
            if (formType === FormType.BOOKING) {
                this.setBookingFormInitialData()
            }
        })
    ), { dispatch: false })


    private setBookingFormInitialData() {
        forkJoin([
            this.eventInfoFromPreviosPromoterEvents$(),
            this.bookingService.findPromoterInfo$()
        ]).pipe(
            tap(([eventInformation, promoterInformation]) => {
                const data = {
                    eventInformation,
                    promoterInformation
                }
                this.store.dispatch(setFormData(data))
            })
        ).subscribe()
    }

    private eventInfoFromPreviosPromoterEvents$() {
        return this.eventService.fetchPromoterEvents$().pipe(
            take(1),
            map(events => events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())),
            switchMap(events => events?.length 
                ? this.dialog.open(EventsFormDataComponent, { data: events }).onClose
                : of(undefined)
            ),
            map(event => event?.formData)
        )
    }

}