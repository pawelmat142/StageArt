import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { LoginComponent } from "../../profile/auth/view/login/login.component";
import { DialogData, PopupComponent } from "./dialogs/popup/popup.component";
import { NavService } from "./nav.service";
import { AppState } from "../../app.state";

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(
        private readonly dialog: MatDialog,
        private readonly store: Store<AppState>,
        private readonly nav: NavService,
    ) {}

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