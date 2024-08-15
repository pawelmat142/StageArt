import { Injectable } from "@angular/core";
import { ArtistViewDto } from "./model/artist-view.dto";
import { Store } from "@ngrx/store";
import { Observable, shareReplay, take } from "rxjs";
import { selectArtists } from "./artists.state";
import { ArtistForm } from "./model/artist-form";
import { HttpService } from "../global/services/http.service";
import { AppState } from "../app.state";
  
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
    
    public findName$(signature: string) {
        return this.http.get<{ name: string }>(`/artist/find-name/${signature}`)
    }

    public fetchArtists$() {
        return this.http.get<ArtistViewDto[]>(`/artists`)
    }

    public updateArtistView$(artist: ArtistViewDto): Observable<ArtistViewDto> {
        return this.http.put<ArtistViewDto>(`/artist`, artist)
    }

    public getArtists = (): ArtistViewDto[] => {
        let result: ArtistViewDto[] = []
        this.store.select(selectArtists).pipe(take(1)).subscribe(x => result = x)
        return result
    }

}