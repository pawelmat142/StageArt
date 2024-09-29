import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Util } from "../utils/util";
import { filter, Observable, switchMap } from "rxjs";
import { Paper } from "./document.service";
import { DialogService } from "../nav/dialog.service";
import { BookingDto } from "../../booking/services/booking.service";

@Injectable({
    providedIn: 'root'
})
export class UploadsService {
    
    constructor(
        private readonly httpClient: HttpClient,
        private readonly dialog: DialogService,
    ) {}

    private readonly apiUri = Util.apiUri

    private readonly HEIC = 'heic'
    private readonly PDF = 'pdf'
    private readonly JPG = 'jpg'
    private readonly JPEG = 'jpeg'
    private readonly PNG = 'png'
    private readonly WEBP = 'webp'
    private readonly MAY_CONVERT_TO_JPG_EXTENSIONS = [this.JPEG, this.JPG, this.PNG, this.WEBP]

    private readonly EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', this.HEIC, this.PDF]

    public uploadFile(booking: BookingDto, template: string): Observable<Paper | undefined> {
        // TODO osobno PDF obsluzyc
        // TODO osobno HEIC obsluzyc
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        return new Observable<File>((observer) => {
            fileInput.onchange = () => {
                const file = fileInput.files?.[0];
                if (!file) {
                    observer.error(`Missing file`)
                    observer.complete()
                    return
                }
                const extension = this.getExtension(file!)

                if (!this.EXTENSIONS.includes(extension)) {
                    observer.error(`Wrong extension`)
                    observer.complete()
                    return
                }
                observer.next(file)
                observer.complete()
            }
            fileInput.click()
        }).pipe(
            filter(file => !!file),
            switchMap(file => this.uploadFile$(booking.formId, template, file)),
        )
    }

    private uploadFile$(formId: string, template: string, file: File): Observable<Paper> {
        const body = new FormData
        body.append('file', file)
        return this.httpClient.post<Paper>(`${this.apiUri}/document/upload/${formId}/${template}`, body)
    }

    private getExtension(file: File): string {
        const split = file.name.split('.')
        const extension = split[split.length - 1]
        if (!extension) {
            throw new Error(`Not found extension`)
        }
        return extension
    }
}