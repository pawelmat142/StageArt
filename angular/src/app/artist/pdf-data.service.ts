import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { HttpService } from "../global/services/http.service";
import { AppState } from "../app.state";
import { PdfDataDto, PdfTemplate } from "./model/document-template.def";

@Injectable({
    providedIn: 'root'
})
export class PdfDataService {

    constructor(
        private http: HttpService,
        private store: Store<AppState>,
    ) {}


    // public setStatus$(status: ArtistStatus, signature: string): Observable<void> {  
    //     return this.http.put<void>(`/artist/set-status/${status}/${signature}`).pipe(
    //     )
    // }

    public getDocumentTemplates$(): Observable<PdfDataDto[]> {
        return of([])
    }

    public getDefaultPdfData$(template: PdfTemplate): Observable<PdfDataDto> {
        return this.http.get<PdfDataDto>(`/pdf-data/default/${template}`)
    }

}