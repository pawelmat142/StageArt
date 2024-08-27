import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { HttpService } from '../../global/services/http.service';
import { FormType } from '../../form-processor/form.state';
import { SelectorItem } from '../../global/controls/selector/selector.component';
import { EventDto } from '../../event/services/event.service';

export type BookingStatus = 'SUBMITTED' | 'DOCUMENTS_REQUESTED' | 'PENDING' | 'READY' | 'CANCELED'


export interface StatusHistory {
  version: number
  status: BookingStatus
  date: Date
  uid: string
  role: string
  info?: string
}

export interface BookingDto {
  formId: string
  promoterUid: string
  managerUid: string
  status: BookingStatus
  artists: SelectorItem[]
  eventSignature: string
  statusHistory: StatusHistory[]
  event: EventDto
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
    return this.http.get<BookingDto[]>(`/booking/list`)
  }

  fetchFormData$(formId: string) {
    return this.http.get<any>(`/booking/form-data/${formId}`)
  }
  
  findPromoterInfo$() {
    return this.http.get<any>(`/booking/promoter-info`)
  }
  
  cancelBooking$(formId: string) {
    return this.http.get<BookingDto>(`/booking/cancel/${formId}`)
  }
  
  requestDocuments$(formId: string) {
    return this.http.get<BookingDto>(`/booking/request-documents/${formId}`)
  }

  signContract$(formId: string) {
    return this.http.get<any>(`/booking/sign-contract/${formId}`)
  }

  
}
