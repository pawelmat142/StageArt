import { Injectable } from "@angular/core";
import { CourtineService } from "../../nav/courtine.service";
import { HttpService } from "../../services/http.service";
import { HandSignature } from "../../../profile/profile.service";
import { noop, Observer, tap } from "rxjs";
import { AppState } from "../../../app.state";
import { Store } from "@ngrx/store";
import { remvoeHandSignature, setHandSignature } from "../../../profile/profile.state";
import { DialogService } from "../../nav/dialog.service";

@Injectable({
    providedIn: 'root'
})
export class SignatureService {
  
    constructor(
      private readonly http: HttpService,
      private readonly courtine: CourtineService,
      private readonly dialog: DialogService,
      private readonly store: Store<AppState>,
    ) { }


    fetchSignature$() {
        this.courtine.startCourtine()
        this.http.get<HandSignature>(`/profile/signature`)
        .subscribe(this.signatureObserver())
    }
    
    setSignature$(signature: HandSignature) {
        this.courtine.startCourtine()
        this.http.put<HandSignature>(`/profile/signature`, signature).pipe(
            tap(() => this.dialog.simplePopup(`Signature uploaded`))
        )
        .subscribe(this.signatureObserver())
    }
    
    removeSignature$() {
        this.courtine.startCourtine()
        return this.http.delete<{ result: boolean }>(`/profile/signature`).subscribe(result => {
            this.courtine.stopCourtine()
            this.store.dispatch(remvoeHandSignature())
            if (result.result) {
                this.dialog.simplePopup(`Signature deleted`)
            }
        })
    }

    private signatureObserver(): Observer<HandSignature> {
        return {
            next: signature => {
                this.courtine.stopCourtine()
                if (signature) {
                    this.store.dispatch(setHandSignature(signature))
                }
            },
            error: error => {
                this.courtine.stopCourtine()
                this.dialog.errorPopup(error.error.message)
            },
            complete: noop
        }
    }
}