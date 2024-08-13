import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../pages/components/header/header.component';
import { InputComponent } from '../../pages/controls/input/input.component';
import { BtnComponent } from '../../pages/controls/btn/btn.component';
import { FormUtil } from '../../utils/form.util';
import { LoginForm, ProfileService } from '../profile.service';
import { SelectorComponent } from "../../pages/controls/selector/selector.component";
import { loggedIn, login, logout } from '../profile.state';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { Token } from '../token';
import { DialogService } from '../../services/nav/dialogs/dialog.service';

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
    private store: Store<AppState>,
  ) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
  })

  _submit() {
    if (!this.form.valid) {
      FormUtil.markForm(this.form)
      return
    }
    const form = this.form.value

    this.store.dispatch(login())

    this.profileService.loginByEmail$(form as Partial<LoginForm>).subscribe({
      next: (token) => {
        Token.set(token.token)
        const profile = Token.payload
        if (profile) {
          this.store.dispatch(loggedIn(profile))
        } else {
          this.store.dispatch(logout())
        }
        this.dialog.simplePopup('Logged in!')
      },
      error: (error) => {
        this.dialog.errorPopup(error.error.message)
      },
    })
  }


  _byTelegram() {
    this.profileService.fetchTelegramBotHref$().subscribe(telegramHref => {
      window.location.href = telegramHref.url
    })
  }

}
