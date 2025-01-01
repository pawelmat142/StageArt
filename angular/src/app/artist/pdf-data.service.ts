import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpService } from "../global/services/http.service";
import { PdfDataDto, PdfTemplate } from "./model/document-template.def";

@Injectable({
    providedIn: 'root'
})
export class PdfDataService {

    constructor(
        private http: HttpService,
    ) {}

    public getDocumentTemplates$(): Observable<PdfDataDto[]> {
        return of([])
    }

    public getDefaultPdfData$(template: PdfTemplate): Observable<PdfDataDto> {
        return this.http.get<PdfDataDto>(`/pdf-data/default/${template}`)
    }

    public list$(artistSignature: string): Observable<PdfDataDto[]> {
        return this.http.get<PdfDataDto[]>(`/pdf-data/list/${artistSignature}`)
    }

    public getByName$(name: string, artistSignature: string): Observable<PdfDataDto> {
        return this.http.get<PdfDataDto>(`/pdf-data/name/${name}/${artistSignature}`)
    }
        
    public save$(artistSignature: string, dto: PdfDataDto): Observable<PdfDataDto> {
        return this.http.put<PdfDataDto>(`/pdf-data/save/${artistSignature}`, dto)
    }

    public delete$(id: string): Observable<void> {
        return this.http.delete<void>(`/pdf-data/${id}`)
    }
    public activate$(id: string): Observable<void> {
        return this.http.get<void>(`/pdf-data/activate/${id}`)
    }

}