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

export interface PaperRequestParams {
    refreshBookingChecklist?: BookingDto
    extension?: string
}

export interface Paper {
    id: string
    formId: string
    template: Template
    extension: string
    status: PaperStatus
}

interface DownloadFile {
    blob: Blob
    filename: Template
    contentType?: string
}

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
  
    private readonly apiUri = `${Util.apiUri}/document`
  
    constructor(
      private readonly httpClient: HttpClient,
      private readonly http: HttpService,
      private readonly courtine: CourtineService,
      private readonly store: Store<AppState>,
    ) { }

    public refreshChecklist$(booking: BookingDto): Observable<ChecklistItem[]> {
        return this.http.get<ChecklistItem[]>(`/document/refresh-checklist/${booking.formId}`).pipe(
            tap(checklist => {
                if (checklist) {
                    this.store.dispatch(updateBooking({
                        ...booking,
                        checklist
                    }))
                }
            })
        )
    }

    public generate(booking: BookingDto, template: Template) {
        this.documentRequest(`/generate/${booking.formId}/${template}`, booking)
    }
    
    public download(paperId: string) {
        this.documentRequest(`/download/${paperId}`)
    }

    public signPaper(paperId: string, signatureId: string, booking: BookingDto) {
        this.documentRequest(`/sign/${paperId}/${signatureId}`, booking)
    }

    public uploadSigned(paperId: string) {
        this.documentRequest(`/upload-signed/${paperId}`)
    }

    public downloadSignedPaper(paperId: string) {
        this.documentRequest(`/download-signed/${paperId}`)
    }

    public deletePaper$(paperId: string): Observable<{ deleted: boolean }> {
        return this.http.delete<{ deleted: boolean }>(`/document/${paperId}`)
    }


    public documentRequest(url: string, refreshBookingChecklist?: BookingDto) {
        this.courtine.startCourtine()
        this.httpClient.get<Blob>(`${this.apiUri}${url}`, {
            observe: 'response',
            responseType: 'blob' as 'json',
        }).pipe(
            map((response: HttpResponse<Blob>) => {
                const body = response.body
                if (!body) {
                    throw new Error('Missing file')
                }
                const contentDisposition = response.headers.get('content-disposition')
                const contentType = response.headers.get('content-type') || undefined
                const filename = this.getFilenameFromContentDisposition(contentDisposition) as Template
                return { filename, blob: response.body, contentType }
            }),
        ).subscribe({
          next: downloadFile => {
            this.downloadFile(downloadFile)
            this.courtine.stopCourtine()
            if (refreshBookingChecklist) {
                this.refreshChecklist$(refreshBookingChecklist).subscribe()
            }
          },
          error: error => {
            console.error(error.error.message)
            this.courtine.stopCourtine()
          }
        })
    }

    private downloadFile(downloadFile: DownloadFile) {
        const blob = new Blob([downloadFile.blob], { type: downloadFile.contentType || 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadFile.filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    private getFilenameFromContentDisposition(contentDisposition: string | null): string {
        if (!contentDisposition) return 'unknown';
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        return matches && matches[1] ? matches[1] : 'unknown';
    }

}