import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, delay, map, tap } from "rxjs";
import { profileLoadingChange } from "../../profile/profile.state";
import { formLoadingChange } from "../../form-processor/form.state";
import { AppState } from "../../app.state";
import { artistViewLoadingChange } from "../../artist/view/artist-view/artist-view.state";

@Injectable({
    providedIn: 'root'
})
export class CourtineService {

    constructor(
        private readonly store: Store<AppState>
    ) {
        combineLatest([
                this.store.select(formLoadingChange),
                this.store.select(profileLoadingChange),
                this.store.select(artistViewLoadingChange),
            ]).pipe(
                map(loadings => loadings.some(loading => loading)),
                tap(loading => this.courtineSubject$.next(loading))
            ).subscribe()
    }

    private courtineSubject$ = new BehaviorSubject(false)


    public get courtine$() {
        return this.courtineSubject$.asObservable().pipe(
            delay(10),
        )
    }

    public startCourtine() {
        this.courtineSubject$.next(true)
    }
    
    public stopCourtine() {
        this.courtineSubject$.next(false)
    }

}