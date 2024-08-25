import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { HttpService } from '../../global/services/http.service';
import { FormType } from '../../form-processor/form.state';

export type BookingStatus = 'SUBMITTED' | 'DOCUMENTS_REQUESTED' | 'PENDING' | 'READY' | 'CANCELED'

export interface BookingPanelDto {
  formId: string
  promotorUid: string
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
  promotorUid: string
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
      .pipe(tap(x => localStorage.removeItem(FormType.BOOKING)))
  }

  fetchProfileBookings$() {
    return this.http.get<BookingPanelDto[]>(`/booking/list`)
  }

  fetchBooking$(formId: string) {
    return this.http.get<Booking>(`/booking/get/${formId}`)
  }
  
  findPromotorInfo$() {
    return this.http.get<any>(`/booking/promotor-info`)
  }
  
  cancelBooking$(formId: string) {
    return this.http.get<BookingPanelDto>(`/booking/cancel/${formId}`)
  }
  
  requestDocuments$(formId: string) {
    return this.http.get<BookingPanelDto>(`/booking/request-documents/${formId}`)
  }

  
}
