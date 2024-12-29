import { Injectable } from "@angular/core";
import { concatMap, forkJoin, from, map, Observable, of, switchMap } from "rxjs";
import { getDownloadURL, ref, uploadBytes, Storage, deleteObject} from "@angular/fire/storage";
import { FireImg, FireImgSet } from "../../artist/model/artist-form";
import { Size, ImgUtil, ImgSize } from "../utils/img.util";
import { Dialog, DialogData } from "../nav/dialog.service";

@Injectable({
    providedIn: 'root'
})
export class FireImgStorageService {

    constructor(
        private storage: Storage,
        private dialog: Dialog,
    ){}

    readonly availableExtensions = ['jpg', 'png']

    public validateExtension(value: File): boolean {
        const split = value.name.split('.')
        if (split.length) {
          const extenstion = split[split.length-1]
          if (this.availableExtensions.includes(extenstion)) {
            return true
          } else {
            this.wrongExtensionPopup(extenstion)
          }
        }
        return false
    }

    private wrongExtensionPopup(extenstion: string) {
        this.dialog.warnToast(`Available extensions: ${this.availableExtensions.join(', ')}`, `Wrong extension: ${extenstion}`)
    }

    public uploadImage$(file: Blob, path: string): Observable<FireImg> {
        const storageRef = ref(this.storage, path)
        return from(uploadBytes(storageRef, file)).pipe(
            concatMap(uploadTask => from(getDownloadURL(uploadTask.ref))),
            map(url => ({ url, firePath: path }))
        )
    }

    public async deleteImage$(fireImg: FireImg) {
        // TODO usuwac caly ImgSet jak już...
        return from(deleteObject(ref(this.storage, fireImg.firePath)))
    }

    createFireImgSet$(_file: File, _path: string, sizes: Size[]): Observable<FireImgSet> {
        const extension = '.jpg'
        const pathSplit = _path.split('/')
        let nameBase = pathSplit.pop()
        const join = pathSplit.join('/')
        const uploads = sizes.map(size => {
            let fileName = `${nameBase}_${size.width}x${size.height}`
            return ImgUtil.resizeImgFile$(_file, `${fileName}${extension}`, size).pipe(
                switchMap(resizedFile => {
                    const path = `${join}/${fileName}`
                    return this.uploadImage$(resizedFile, path)
                })
            )
        })
        return forkJoin(uploads).pipe(map(fireImgs => {
            const fireImgSet: FireImgSet = {
                name: nameBase || 'test'
            }
            fireImgs.forEach((fireImg, i) => {
                const size = sizes[i]
                if (size.width === ImgSize.bg.width) {
                    fireImgSet.bg = fireImg
                } 
                else if (size.width === ImgSize.bgMobile.width) {
                    fireImgSet.bgMobile = fireImg
                }
                else if (size.width === ImgSize.avatar.width) {
                    fireImgSet.avatar = fireImg
                }
                else if (size.width === ImgSize.avatarMobile.width) {
                    fireImgSet.avatarMobile = fireImg
                }
                else if (size.width === ImgSize.mini.width) {
                    fireImgSet.mini = fireImg
                }
            })
            return fireImgSet
        }))
    }


}