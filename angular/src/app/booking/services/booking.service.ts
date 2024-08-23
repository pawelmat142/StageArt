import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { HttpService } from '../../global/services/http.service';

export type BookingStatus = 'SUBMITTED' | 'PENDING' | 'READY' | 'CANCELED'

export interface BookingPanelDto {
  formId: string
  promoterUid: string
  managerUid: string
  status: BookingStatus
  submitDate?: Date

  artistSignatures: string[]
  artistNames: string[]

  eventName: string
  eventStartDate: Date
  eventEndDate?: Date
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
    return this.http.get<BookingPanelDto[]>(`/booking/list`)
  }

  fetchBooking$(formId: string) {
    return this.http.get<Booking>(`/booking/get/${formId}`)
  }
  
  findPromoterInfo$() {
    return this.http.get<any>(`/booking/promoter-info`)
  }
}
