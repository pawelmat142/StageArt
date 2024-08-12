import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";
import { ArtistForm } from "./model/artist-form";
import { ArtistViewDto } from "./model/artist-view.dto";
import { AppState } from "../../store/app.state";
import { Store } from "@ngrx/store";
import { take } from "rxjs";
import { selectArtists } from "../../store/artist/artists.state";
  
@Injectable({
    providedIn: 'root'
})
export class ArtistService {

    constructor(
        private http: HttpService,
        private store: Store<AppState>,
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

    public getArtists = (): ArtistViewDto[] => {
        let result: ArtistViewDto[] = []
        this.store.select(selectArtists).pipe(take(1)).subscribe(x => result = x)
        return result
    }


}