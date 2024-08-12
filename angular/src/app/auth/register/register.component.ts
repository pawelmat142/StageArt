import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../../pages/components/header/header.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../pages/controls/input/input.component';
import { BtnComponent } from "../../pages/controls/btn/btn.component";
import { FormUtil } from '../../utils/form.util';
import { LoginForm, ProfileService } from '../profile.service';
import { SelectorComponent, SelectorItem } from '../../pages/controls/selector/selector.component';
import { CourtineService } from '../../services/nav/courtine.service';
import { NavService } from '../../services/nav/nav.service';
import { LoginComponent } from '../login/login.component';

function repassword(): ValidatorFn {
  const error = { mismatch: true }
  return (control: AbstractControl): ValidationErrors | null => {

    const passwordControl = control.parent?.get('password')

    if (passwordControl?.value !== control.value) {
      return error
    }
    return null
  }
}

function password(): ValidatorFn {
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
    BtnComponent,
    SelectorComponent
],
  templateUrl: './register.component.html',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {

  public static readonly path = 'register'

  constructor(
    private profileService: ProfileService,
    private courtineService: CourtineService,
    private nav: NavService,
  ) {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(6), Validators.required, password()]),
    repassword: new FormControl('', [Validators.required, repassword()]),
  })

  _roleSelectorItems: SelectorItem[] = [{
    code: 'MANAGER',
    name: 'Manager',
  }, {
    code: 'ARTIST',
    name: 'Artist'
  }, {
    code: 'PROMOTER',
    name: 'Promoter'
  }]

  _submit() {
    if (!this.form.valid) {
      FormUtil.markForm(this.form)
      return
    }
    const form = this.form.value

    this.courtineService.startCourtine()

    this.profileService.createProfileEmail$(form as LoginForm).subscribe({
      next: () => { 
        this.nav.to(LoginComponent.path)
        this.courtineService.stopCourtine()
      },
      error: (error) => {
        this.nav.errorPopup(error.error.message)
        this.courtineService.stopCourtine()
      },
    })
  }

  _byTelegram() {
    this.profileService.fetchTelegramBotHref$().subscribe(telegramHref => {
      window.location.href = telegramHref.url
    })
  }

}
