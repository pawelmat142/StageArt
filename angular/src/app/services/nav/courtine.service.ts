import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject, skip } from "rxjs";
import { AppState } from "../../store/app.state";
import { profileLoadingChange } from "../../auth/profile.state";
import { formLoadingChange } from "../../form-processor/form.state";

@Injectable({
    providedIn: 'root'
})
export class CourtineService {

    constructor(
        private readonly store: Store<AppState>
    ) {
        this.store.select(formLoadingChange).pipe(skip(1))
            .subscribe(loading => this.courtineSubject$.next(loading))

        this.store.select(profileLoadingChange).pipe(skip(1))
            .subscribe(loading => this.courtineSubject$.next(loading))
    }

    private courtineSubject$ = new BehaviorSubject(false)

    public get courtine$() {
        return this.courtineSubject$.asObservable()
    }

    public startCourtine() {
        this.courtineSubject$.next(true)
    }

    public stopCourtine() {
        this.courtineSubject$.next(false)
    }

}