import { Injectable } from "@angular/core";
import { HttpService } from "../../global/services/http.service";
import { Observable } from "rxjs";

export type EventStatus = 'CREATED' | 'ACTIVE' | 'INACTIVE'

export interface EventDto {
    signature: string
    promoterUid: string
    status: EventStatus
    name: string
    startDate: Date
    endDate?: Date
    formData: any
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
  
    constructor(
      private readonly http: HttpService,
    ) { }

    fetchPromoterEvents$(): Observable<EventDto[]> {
        return this.http.get<EventDto[]>(`/event/list/panel`)
    }
}