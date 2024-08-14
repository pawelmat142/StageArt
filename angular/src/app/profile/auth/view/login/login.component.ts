import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnComponent } from '../../../../global/controls/btn/btn.component';
import { SelectorComponent } from "../../../../global/controls/selector/selector.component";
import { loggedIn, login, logout } from '../../../profile.state';
import { Store } from '@ngrx/store';
import { Token } from '../token';
import { MatDialog } from '@angular/material/dialog';
import { PinViewComponent } from '../pin-view/pin-view.component';
import { filter, map, noop, Observer, of, switchMap } from 'rxjs';
import { FormUtil } from '../../../../global/utils/form.util';
import { LoginForm, ProfileService } from '../../../profile.service';
import { ProfileComponent } from '../../../view/profile/profile.component';
import { HeaderComponent } from '../../../../global/components/header/header.component';
import { DialogService } from '../../../../global/nav/dialog.service';
import { NavService } from '../../../../global/nav/nav.service';
import { InputComponent } from '../../../../global/controls/input/input.component';
import { AppState } from '../../../../app.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    InputComponent,
    BtnComponent,
    SelectorComponent
],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  public static readonly path = 'login'

  constructor(
    private profileService: ProfileService,
    private dialog: DialogService,
    private nav: NavService,
    private readonly matDialog: MatDialog,
    private store: Store<AppState>,
  ) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
  })

  private loginToken?: string

  _nameOrEmailForm?: FormGroup
  
  _submit() {
    if (this._nameOrEmailForm) {
      if (this._nameOrEmailForm.valid) {
        this.loginRequest(this._nameOrEmailForm.controls['nameOrEmail'].value)
      }
    }

    if (!this.form.valid) {
      FormUtil.markForm(this.form)
      return
    }
    const form = this.form.value

    this.store.dispatch(login())

    this.profileService.loginByEmail$(form as Partial<LoginForm>).subscribe(this.loginResultObserver())
  }


  _byTelegram() {
    const uid = Token.payload?.uid || Token.getUid()
    if (uid) {
      this.loginRequest(uid)
    } else {
      this.setNameOrEmailForm()
    }
  }

  private setNameOrEmailForm() {
    this._nameOrEmailForm = new FormGroup({
      nameOrEmail: new FormControl('', Validators.required)
    })
  }

  private loginRequest(uidOrNameOrEmail: string) {
    this.profileService.telegramPinRequest$(uidOrNameOrEmail).pipe(
      switchMap(token => {
        if (!token?.token) {
          return of(noop())
        }
        this.loginToken = token.token
        return this.matDialog.open(PinViewComponent).afterClosed()
      }),
      filter(pin => !!pin),
      switchMap(pin => this.profileService.loginByPin$({
        pin: pin,
        token: this.loginToken!
      })),
    ).subscribe(this.loginResultObserver())
  }



  private loginResultObserver(): Observer<{ token: string }> {
    return {
      next: (token: { token: string }) => {
        Token.set(token.token)
        const profile = Token.payload
        if (profile) {
          this.store.dispatch(loggedIn(profile))
          this.nav.to(ProfileComponent.path)
          this.dialog.simplePopup('Logged in!')
        } else {
          this.store.dispatch(logout())
        }
      },
      error: (error: any) => {
        this.dialog.errorPopup(error.error.message)
      },
      complete: () => noop()
    }
  }

}
