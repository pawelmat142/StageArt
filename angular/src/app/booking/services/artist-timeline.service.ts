import { Injectable } from "@angular/core";
import { HttpService } from "../../global/services/http.service";
import { SelectorItem } from "../../global/interface";
import { BookingStatus } from "./booking.service";
import { Observable } from "rxjs";

export interface EventInformation {
    performanceStartDate: Date
    performanceEndDate?: Date
    eventName?: string
    eventCountry?: SelectorItem
    venueCapacity?: number
}

export interface TimelineItem {
    formId: string,
    status: BookingStatus,
    eventSignature: string,
    formData: { eventInformation: EventInformation }
}

@Injectable({
  providedIn: 'root'
})
export class ArtistTimelineService {

  constructor(
    private readonly http: HttpService,
  ) { }

  artistTimeline$(artistSignature: string): Observable<TimelineItem[]> {
    return this.http.get<TimelineItem[]>(`/booking/artist-timeline/${artistSignature}`)
  }

}