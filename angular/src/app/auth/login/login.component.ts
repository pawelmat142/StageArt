import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../pages/components/header/header.component';
import { InputComponent } from '../../pages/controls/input/input.component';
import { BtnComponent } from '../../pages/controls/btn/btn.component';
import { FormUtil } from '../../utils/form.util';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    InputComponent,
    BtnComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public static readonly path = 'login'

  constructor(
    private profileService: ProfileService,
  ) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(6), Validators.required]),
  })

  _submit() {
    console.log('submit')
    if (this.form.invalid) {
      FormUtil.markForm(this.form)
      return
    }

  }

  _byTelegram() {
    this.profileService.fetchTelegramBotHref$().subscribe(telegramHref => {
      window.location.href = telegramHref.url
    })
  }

}
