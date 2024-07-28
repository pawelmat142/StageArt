import { inject, Injectable } from "@angular/core";
import { HttpService } from "../http.service";
import { ArtistForm, FireImg } from "./model/artist-form";
import { deleteObject, getDownloadURL, ref, Storage, uploadBytes } from "@angular/fire/storage";
import { concatMap, from, map, Observable } from "rxjs";
  
@Injectable({
    providedIn: 'root'
})
export class ArtistService {

    constructor(
        private http: HttpService,
        private storage: Storage
    ) {}

    public createArtist$(artist: ArtistForm) {
        return this.http.post<ArtistForm>('/artist', artist)
    }


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

}