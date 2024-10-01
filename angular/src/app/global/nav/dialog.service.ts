import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { LoginComponent } from "../../profile/auth/view/login/login.component";
import { DialogData, PopupComponent } from "./dialogs/popup/popup.component";
import { NavService } from "./nav.service";
import { AppState } from "../../app.state";
import { Observable, Subject } from "rxjs";
import { Message } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(
        private readonly dialog: MatDialog,
        private readonly store: Store<AppState>,
        private readonly nav: NavService,
    ) {}

    /*
        TOASTS
    */
    private tostSubject$ = new Subject<Message>()
    public get toast$(): Observable<Message> {
        return this.tostSubject$.asObservable()
    }

    public toast(message: Message) {
        message.key = 'br'
        this.tostSubject$.next(message)
    }

    succesToast = (detail: string, summary = 'Success') => this.toast({ severity: 'success', summary, detail })
    infoToast = (detail: string, summary = 'Info') => this.toast({ severity: 'info', summary, detail })
    warnToast = (detail: string, summary = 'Warn') => this.toast({ severity: 'warn', summary, detail })
    errorToast = (detail: string, summary = 'Error') => this.toast({ severity: 'error', summary, detail })



    /*
        POPUPS
    */
    public simplePopup(header: string) {
        const data = { header }
        return this.popup(data)
      }
    
    public popup(data: DialogData) {
        return this.dialog.open(PopupComponent, { data })
    }
      
    public async errorPopup(msg: string, content: string[] = []) {
        const data: DialogData = {
          header: msg,
          content: content,
          isError: true
        }
        return this.popup(data)
    }
      
    public async sww() {
        const data: DialogData = {
          header: 'Something went wrong',
          content: ['Please contact service'],
        }
        return this.popup(data)
    }

    public loginPopup(msg?: string) {
        const data: DialogData = {
            header: msg || 'You neeed to log in before submitting the form',
            buttons: [{
                label: 'Close',
            }, {
                label: 'To login',
                class: 'grey',
                onclick: () => this.nav.to(LoginComponent.path)
            }]
        }
        return this.popup(data)
    }

    public yesOrNoPopup(msg?: string) {
        const dialg: DialogData = {
            header: msg || `Yes or no?`,
            buttons: [{
              label: 'No',
              class: 'big'
            }, {
              label: 'Yes',
              class: 'big light',
              result: true,
            }]
        }
        return this.popup(dialg).afterClosed()
    }

}