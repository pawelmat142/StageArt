import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Util } from "../utils/util";
import { map } from "rxjs";
import { Template } from "./doc-util";

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
    ) { }


    public getPdf(formId: string, template: Template) {
        this.httpClient.get<Blob>(`${this.apiUri}/booking/get-pdf/${formId}/${template}`,  { 
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
          next: pdf => this.downloadPdf(pdf),
          error: error => console.error(error)
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