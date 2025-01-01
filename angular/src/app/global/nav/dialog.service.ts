import { Injectable } from "@angular/core";
import { filter, Observable, Subject } from "rxjs";
import { Message } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { PopupComponent } from "./dialogs/popup/popup.component";
import { ValidatorFn } from "@angular/forms";
import { Chip } from "../../artist/model/artist-view.dto";
import { SelectorItem } from "../interface";
import { HttpErrorResponse } from "@angular/common/http";

export interface DialogData {
    header: string
    content?: string[]
    isError?: boolean
    error?: Error
    buttons?: DialogBtn[]
    input?: string
    inputValidators?: ValidatorFn[]
    inputClass?: string
    inputValue?: string
    select?: string
    chips?: Chip[]
    items?: Observable<SelectorItem[]>
  }
  
  export interface DialogBtn {
    label: string
    severity?: Severity
    result?: any
    type?: 'button' | 'submit'
    onclick?: () => any
  }

  export type Severity = 'success' | 'info' | 'warning' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined


@Injectable({
    providedIn: 'root'
})
export class Dialog extends DialogService {

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
    public popup = (data: DialogData) => {
        return this.open(PopupComponent, {
            closable: false,
            header: data.header, 
            data
        })
    }

    public simplePopup(header: string) {
        const data = { header }
        return this.popup(data)
    }

    public errorPopup = (error: string | Error | HttpErrorResponse, content: string[] = []) => {
      if (error instanceof Error) {
        return this._errorPopup(error.message, content)
      }
      if (error instanceof HttpErrorResponse) {
        return this._errorPopup(error.statusText, content)
      }
      return this._errorPopup(error, content)
    }
    
    private _errorPopup = (msg: string, content: string[] = []) => {
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

    public yesOrNoPopup(msg?: string, returnConfirmed?: boolean) {
        const dialg: DialogData = {
            header: msg || `Yes or no?`,
            buttons: [{
              label: 'No',
              severity: 'secondary'
            }, {
              label: 'Yes',
              result: true,
            }]
        }
        return this.popup(dialg).onClose.pipe(
          filter(confirm => returnConfirmed ? true : !!confirm),
        )
    }

}