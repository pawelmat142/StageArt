import { Injectable } from "@angular/core";
import { HttpService } from "../../global/services/http.service";
import { Observable } from "rxjs";

export type EventStatus = 'CREATED' | 'ACTIVE' | 'INACTIVE'

export interface EventPanelDto {
    signature: string
    promotorUid: string
    status: EventStatus
    name: string
    startDate: Date
    endDate?: Date
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
  
    constructor(
      private readonly http: HttpService,
    ) { }

    fetchPromotorEvents$(): Observable<EventPanelDto[]> {
        return this.http.get<EventPanelDto[]>(`/event/list/panel`)
    }
}