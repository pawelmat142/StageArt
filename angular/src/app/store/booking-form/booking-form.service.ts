import { Injectable } from "@angular/core";
import { BookingForm, EventDetails } from "./booking-form.model";
import { HttpService } from "../../services/http.service";
import { Observable, take, tap } from "rxjs";
import { createSelector, Store } from "@ngrx/store";
import { AppState, selectBookingForm } from "../app.state";
import { BookingFormState } from "./booking-form.state";

export const selectFormId = createSelector(
    selectBookingForm,
    (bookingFormState: BookingFormState) => bookingFormState.form.id
);

export const selectIsLoading = createSelector(
    selectBookingForm,
    (bookingFormState: BookingFormState) => bookingFormState.loading
)

@Injectable({
    providedIn: 'root'
})
export class BookingFormService {

    public static readonly LOCAL_STORAGE_KEY = "booking-form-id"
  
    constructor(
        private readonly http: HttpService,
        private readonly store: Store<AppState>,
    ) {}

    public getId$(): Observable<string> {
        return this.store.select(selectFormId).pipe(take(1));
    }

    public openForm$(id: string) {
        return this.http.get<BookingForm>(`/booking/open/${id}`)
    }

    public startForm$(body: BookingForm) {
        return this.http.post<{ id: string }>(`/booking/start`, body).pipe(tap(id => {
            localStorage.setItem(BookingFormService.LOCAL_STORAGE_KEY, id.id)
        }))
    }

    public storeForm$(body: BookingForm, bookingId: string) {
        return this.http.put<EventDetails>(`/booking/store/${bookingId}`, body)
    }

}