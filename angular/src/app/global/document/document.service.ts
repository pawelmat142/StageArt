import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Util } from "../utils/util";
import { map, Observable, take, tap } from "rxjs";
import { Template } from "./doc-util";
import { CourtineService } from "../nav/courtine.service";
import { HttpService } from "../services/http.service";
import { ChecklistItem } from "../../booking/interface/checklist.interface";
import { AppState } from "../../app.state";
import { Store } from "@ngrx/store";
import { BookingDto } from "../../booking/services/booking.service";
import { updateBooking } from "../../profile/profile.state";

export type PaperStatus = 'GENERATED' | 'SIGNED' | 'VERIFIED' | 'ERROR'

export interface Paper {
    id: string
    formId: string
    template: Template
    extension: string
    status: PaperStatus
}

interface Pdf {
    blob: Blob
    filename: Template
}

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
  
    private readonly apiUri = Util.apiUri
  
    constructor(
      private readonly httpClient: HttpClient,
      private readonly http: HttpService,
      private readonly courtine: CourtineService,
      private readonly store: Store<AppState>,
    ) { }

    public refreshChecklist$(booking: BookingDto)    {
        this.http.get<ChecklistItem[]>(`/document/refresh-checklist/${booking.formId}`).pipe(
            take(1),
            tap(checklist => {
                if (checklist) {
                    this.store.dispatch(updateBooking({
                        ...booking,
                        checklist
                    }))
                }
            })
        ).subscribe()
    }

    public generate(booking: BookingDto, template: Template) {
        this.documentRequest(`${this.apiUri}/document/generate/${booking.formId}/${template}`, booking)
    }
    
    public download(paperId: string) {
        this.documentRequest(`${this.apiUri}/document/download/${paperId}`)
    }

    // TODO
    public sign(paperId: string) {
        this.documentRequest(`${this.apiUri}/document/sign/${paperId}`)
    }

    public uploadSigned(paperId: string) {
        this.documentRequest(`${this.apiUri}/document/upload-signed/${paperId}`)
    }

    public upload(paperId: string) {
        this.documentRequest(`${this.apiUri}/document/upload/${paperId}`)
    }

    public verify(paperId: string) {
        this.documentRequest(`${this.apiUri}/document/verify/${paperId}`)
    }

    public downloadSigned(paperId: string) {
        this.documentRequest(`${this.apiUri}/document/download-signed/${paperId}`)
    }
    // END TODO


    private documentRequest(url: string, refreshBookingChecklist?: BookingDto) {
        this.courtine.startCourtine()
        this.httpClient.get<Blob>(url, {
            observe: 'response',
            responseType: 'blob' as 'json',
        }).pipe(
            map((response: HttpResponse<Blob>) => {
                const body = response.body
                if (!body) {
                    throw new Error('Missing file')
                }
                const contentDisposition = response.headers.get('content-disposition');
                const filename = this.getFilenameFromContentDisposition(contentDisposition) as Template;
                return { filename, blob: response.body };
            }),
        ).subscribe({
          next: pdf => {
            this.downloadPdf(pdf)
            this.courtine.stopCourtine()
            if (refreshBookingChecklist) {
                this.refreshChecklist$(refreshBookingChecklist)
            }
          },
          error: error => {
            console.error(error.error.message)
            this.courtine.stopCourtine()
          }
        })
    }

    private downloadPdf(pdf: Pdf) {
        const blob = new Blob([pdf.blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdf.filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    private getFilenameFromContentDisposition(contentDisposition: string | null): string {
        if (!contentDisposition) return 'unknown';
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        return matches && matches[1] ? matches[1] : 'unknown';
    }

}