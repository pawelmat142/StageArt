import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";
import { ArtistForm } from "./model/artist-form";
import { ArtistViewDto } from "./model/artist-view.dto";
  
@Injectable({
    providedIn: 'root'
})
export class ArtistService {

    constructor(
        private http: HttpService,
    ) {}

    public createArtist$(artist: ArtistForm) {
        return this.http.post<ArtistForm>('/artist', artist)
    }

    public fetchArtist$(artistName: string) {
        return this.http.get<ArtistViewDto>(`/artist/${artistName}`)
    }

    public fetchArtists$() {
        return this.http.get<ArtistViewDto[]>(`/artists`)
    }

}