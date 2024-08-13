import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { tap } from 'rxjs';

export type BookingStatus = 'SUBMITTED' | 'PENDING' | 'READY' | 'CANCELED'

export interface BookingListDto {
  formId: string
  status: BookingStatus
  startDate: Date
  endDate?: Date
  submitDate?: Date
  promoterUid: string
  managerUid: string
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private readonly http: HttpService,
  ) { }

  submitForm$(formId: string) {
    return this.http.get(`/booking/submit/${formId}`)
      .pipe(tap(x => localStorage.removeItem('BOOKING')))
  }

  fetchProfileBookings$() {
    return this.http.get<BookingListDto[]>(`/booking/list`)
  }

}
