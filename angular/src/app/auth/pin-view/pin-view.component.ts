import { CommonModule } from '@angular/common';
import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../pages/controls/input/input.component';
import { ProfileService } from '../profile.service';
import { FormUtil } from '../../utils/form.util';
import { BtnComponent } from '../../pages/controls/btn/btn.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavService } from '../../services/nav/nav.service';
import { Token } from '../token';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { loggedIn, login, logout } from '../profile.state';
import { DialogService } from '../../services/nav/dialogs/dialog.service';

@Component({
  selector: 'app-pin-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    BtnComponent,
  ],
  templateUrl: './pin-view.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PinViewComponent {

  constructor(
    private readonly profileService: ProfileService,
    private readonly store: Store<AppState>,
    private readonly nav: NavService,
    private readonly dialog: DialogService,
    private readonly dialogRef: MatDialogRef<PinViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { token: string },
  ) {}

  form = new FormGroup({
    pin: new FormControl('', [Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])
  })
  
  _submit() {
    if (this.form.invalid) {
      FormUtil.markForm(this.form)
      return
    }

    this.nav.home()
    this.dialogRef.close()
    this.store.dispatch(login())

    this.profileService.loginByPin$({
      pin: this.form.controls.pin.value!,
      token: this.data.token
    }).subscribe({
      next: token => {
        Token.setToken(token.token)
        const profile = Token.payload
        if (profile) {
          this.store.dispatch(loggedIn(profile))
        } else {
          this.store.dispatch(logout())
        }
      },
      error: error => {
        this.store.dispatch(logout())
        this.dialog.errorPopup(error.error.message)
      }
    })

  }

  private setSession(res: { token: string }) {
    const token = res?.token
    if (!token) {
        throw new Error('TOKEN MISSING')
    }




    Token.setToken(token)
  }


}
