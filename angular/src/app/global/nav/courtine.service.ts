import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, combineLatest, delay, map, skip, tap } from "rxjs";
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
                this.store.select(formLoadingChange).pipe(skip(1)),
                this.store.select(profileLoadingChange).pipe(skip(1)),
                this.store.select(artistViewLoadingChange).pipe(skip(1)),
            ]).pipe(
                map(loadings => loadings.every(loading => loading)),
                tap(loading => this.courtineSubject$.next(loading))
            ).subscribe()
    }

    private courtineSubject$ = new BehaviorSubject(false)


    public get courtine$() {
        return this.courtineSubject$.asObservable().pipe(
            // TODO temporary: 
            delay(500)
        )
    }

    public startCourtine() {
        this.courtineSubject$.next(true)
    }

    public stopCourtine() {
        this.courtineSubject$.next(false)
    }

}