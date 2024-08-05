import { Injectable } from "@angular/core";
import { concatMap, forkJoin, from, map, Observable, of, switchMap } from "rxjs";
import { FireImg, FireImgSet } from "./artist/model/artist-form";
import { getDownloadURL, ref, uploadBytes, Storage, deleteObject} from "@angular/fire/storage";
import {  ImgSize, ImgUtil, Size } from "../utils/img.util";

@Injectable({
    providedIn: 'root'
})
export class FireImgStorageService {

    constructor(
        private storage: Storage
    ){}

    public uploadImage$(file: Blob, path: string): Observable<FireImg> {
        const storageRef = ref(this.storage, path)
        return from(uploadBytes(storageRef, file)).pipe(
            concatMap(uploadTask => from(getDownloadURL(uploadTask.ref))),
            map(url => ({ url, firePath: path }))
        )
    }

    public async deleteImage$(fireImg: FireImg) {
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
                else if (size.width === ImgSize.miniBg.width) {
                    fireImgSet.miniBg = fireImg
                }
                else if (size.width === ImgSize.avatar.width) {
                    fireImgSet.avatar = fireImg
                }
                else if (size.width === ImgSize.mini.width) {
                    fireImgSet.mini = fireImg
                }
            })
            return fireImgSet
        }))
    }


}