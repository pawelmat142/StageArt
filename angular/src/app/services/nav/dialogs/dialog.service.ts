import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AppState } from "../../../store/app.state";
import { Store } from "@ngrx/store";
import { DialogData, PopupComponent } from "./popup/popup.component";
import { NavService } from "../nav.service";
import { LoginComponent } from "../../../auth/login/login.component";

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(
        private readonly dialog: MatDialog,
        private readonly store: Store<AppState>,
        private readonly nav: NavService,
    ) {}

    public async simplePopup(header: string) {
        const data = { header }
        return this.popup(data)
      }
    
      public async popup(data: DialogData) {
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
}