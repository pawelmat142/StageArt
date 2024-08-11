import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../../pages/components/header/header.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../pages/controls/input/input.component';
import { BtnComponent } from "../../pages/controls/btn/btn.component";
import { FormUtil } from '../../utils/form.util';
import { ProfileService } from '../profile.service';

export function repassword(): ValidatorFn {
  const error = { mismatch: true }
  return (control: AbstractControl): ValidationErrors | null => {

    const passwordControl = control.parent?.get('password')

    if (passwordControl?.value !== control.value) {
      return error
    }
    return null
  }
}

export function password(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const repasswordControl = control.parent?.get('repassword')
    if (repasswordControl?.touched) {
      repasswordControl.updateValueAndValidity()
    }
    return null
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    InputComponent,
    BtnComponent
],
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {

  public static readonly path = 'register'

  constructor(
    private profileService: ProfileService,
  ) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(6), Validators.required, password()]),
    repassword: new FormControl('', [Validators.required, repassword()]),
  })

  _submit() {
    console.log('submit')
    if (!this.form.valid) {
      FormUtil.markForm(this.form)
      return
    }
  }

  _byTelegram() {
    this.profileService.fetchTelegramBotHref$().subscribe(x => {
      window.location.href = x.url
    })
  }


}
