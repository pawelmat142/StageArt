import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Util } from "../utils/util";
import { filter, Observable, of, switchMap } from "rxjs";
import { Paper } from "./document.service";
import { Dialog } from "../nav/dialog.service";
import { BookingDto } from "../../booking/services/booking.service";
import { ImgUtil, Size } from "../utils/img.util";

@Injectable({
    providedIn: 'root'
})
export class UploadsService {
    
    private readonly A4_FORMAT_SIZE = {
        MINI: {
            width: 595,
            height: 842
        } as Size,
        MID: {
            width: 1240,
            height: 1754
        } as Size
    }


    constructor(
        private readonly httpClient: HttpClient,
        private readonly dialog: Dialog,
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
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        let extension = ''
        return new Observable<File>((observer) => {
            fileInput.onchange = () => {
                const file = fileInput.files?.[0];
                if (!file) {
                    observer.error(`Missing file`)
                    observer.complete()
                    return
                }
                extension = this.getExtension(file!)
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
            switchMap(file => {
                if (this.HEIC === extension) {
                    return ImgUtil.heicToJpg(file)
                }
                return of(file)
            }),
            switchMap(file => {
                if (this.MAY_CONVERT_TO_JPG_EXTENSIONS.includes(this.getExtension(file))) {
                    return ImgUtil.resizeImgFile$(file, undefined, this.A4_FORMAT_SIZE.MID)
                }
                return of(file)
            }),
  
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