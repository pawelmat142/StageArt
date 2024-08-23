import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { HttpService } from '../../global/services/http.service';

export type BookingStatus = 'SUBMITTED' | 'PENDING' | 'READY' | 'CANCELED'

export interface BookingListDto {
  formId: string
  status: BookingStatus
  submitDate?: Date
  promoterUid: string
  managerUid: string
}

export interface Booking {
  formId: string
  promoterUid: string
  managerUid: string
  status: BookingStatus
  submitDate?: Date
  startDate: Date
  endDate?: Date
  artistSignatures: string[]
  artistNames: string[]
  eventName: string
  formData?: any
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

  fetchBooking$(formId: string) {
    return this.http.get<Booking>(`/booking/get/${formId}`)
  }
  
  findPromoterInfo$() {
    return this.http.get<any>(`/booking/promoter-info`)
  }
}
