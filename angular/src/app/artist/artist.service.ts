import { Injectable } from "@angular/core";
import { ArtistViewDto, FetchArtistQuery } from "./model/artist-view.dto";
import { Store } from "@ngrx/store";
import { Observable, take } from "rxjs";
import { selectArtists } from "./artists.state";
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

    public fetchArtist$(query: FetchArtistQuery) {
        let url = `/artist`
        if (query.signature) {
           url = `${url}?signature=${query.signature}`
        } else if (query.name) {
            url = `${url}?name=${query.name}`
        }
        return this.http.get<ArtistViewDto>(url)
    }

    public createArtist$(form: any) {
        return this.http.post<ArtistViewDto>(`/artist/create`, form)
    }

    public getArtist$(signature: string) {
        return this.http.get<ArtistViewDto>(`/artist/get/${signature}`)
    }
    
    public findName$(signature: string) {
        return this.http.get<{ name: string }>(`/artist/find-name/${signature}`)
    }

    public fetchArtists$() {
        return this.http.get<ArtistViewDto[]>(`/artists`)
    }

    public updateArtistView$(artist: ArtistViewDto): Observable<ArtistViewDto> {
        return this.http.put<ArtistViewDto>(`/artist`, artist).pipe(
        )
    }

    public getArtists = (): ArtistViewDto[] => {
        let result: ArtistViewDto[] = []
        this.store.select(selectArtists).pipe(take(1)).subscribe(x => result = x)
        return result
    }

}