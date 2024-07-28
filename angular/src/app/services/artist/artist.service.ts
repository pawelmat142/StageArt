import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";
import { ArtistForm } from "./model/artist-form";
  
@Injectable({
    providedIn: 'root'
})
export class ArtistService {

    constructor(
        private http: HttpService
    ) {}

    public createArtist$(artist: ArtistForm) {
        return this.http.post<ArtistForm>('/artist', artist)
    }

}