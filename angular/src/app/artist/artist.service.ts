import { Injectable } from "@angular/core";
import { ArtistLabel, ArtistStatus, ArtistStyle, ArtistViewDto, FetchArtistQuery } from "./model/artist-view.dto";
import { Store } from "@ngrx/store";
import { combineLatest, filter, map, Observable, shareReplay, take } from "rxjs";
import { selectArtists } from "./artists.state";
import { HttpService } from "../global/services/http.service";
import { AppState } from "../app.state";
import { TimelineItem } from "../booking/services/artist-timeline.service";

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

    public fetchArtists$() {
        return this.http.get<ArtistViewDto[]>(`/artists`)
    }

    public updateArtistView$(artist: ArtistViewDto): Observable<ArtistViewDto> {
        return this.http.put<ArtistViewDto>(`/artist`, artist).pipe(
        )
    }

    public listMusicStyles$(): Observable<ArtistStyle[]> {  
        return this.http.get<ArtistStyle[]>(`/list-music-styles`).pipe(
        )
    }

    public listArtistLabels$(): Observable<ArtistLabel[]> {  
        return this.http.get<ArtistLabel[]>(`/artist/list-labels`).pipe(
        )
    }

    public fetchArtistsOfManager$(): Observable<ArtistViewDto[]> {  
        return this.http.get<ArtistViewDto[]>(`/artists/of-manager`).pipe(
        )
    }

    public putManagementNotes$(form: { managmentNotes: string, artistSignture: string }): Observable<void> {  
        return this.http.put<void>(`/artist/management-notes`, form).pipe(
        )
    }

    public setStatus$(status: ArtistStatus, signature: string): Observable<void> {  
        return this.http.put<void>(`/artist/set-status/${status}/${signature}`).pipe(
        )
    }

    public getTimeline$(artistSignature: string): Observable<{ timeline: TimelineItem[] }> {  
        return this.http.get<{ timeline: TimelineItem[] }>(`/artist/timeline/${artistSignature}`)
    }

    public submitTimelineEvent$(artistSignature: string, body: TimelineItem): Observable<TimelineItem[]> {  
        return this.http.put<TimelineItem[]>(`/artist/submit-timeline-event/${artistSignature}`, body)
    }


    public getArtists = (): ArtistViewDto[] => {
        let result: ArtistViewDto[] = []
        this.store.select(selectArtists).pipe(take(1)).subscribe(x => result = x)
        return result
    }

    public artistViewEditable$ = combineLatest([
           this.store.select(state => state.artistViewState.artist?.signature).pipe(filter(s => !!s)),
           this.store.select(state => state.profileState.profile?.artistSignature).pipe(filter(s => !!s)),
         ]).pipe(
           map(([signatureOfArtistView, artistProfileSignature]) => signatureOfArtistView === artistProfileSignature),
           shareReplay(),
         )

}