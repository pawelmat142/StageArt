import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpService } from '../../global/services/http.service';
import { FormType } from '../../form-processor/form.state';
import { SelectorItem } from '../../global/controls/selector/selector.component';
import { EventDto } from '../../event/services/event.service';
import { ChecklistItem } from '../interface/checklist.interface';

export type BookingStatus = 'SUBMITTED' | 'DOCUMENTS' | 'CHECKLIST_COMPLETE' | 'PENDING' | 'READY' | 'CANCELED'

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
  checklist: ChecklistItem[]
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

  fetchProfileBookings$(): Observable<BookingDto[]> {
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

}
