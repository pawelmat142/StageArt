import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BtnComponent } from "../../../../global/controls/btn/btn.component";
import { SelectorComponent, SelectorItem } from '../../../../global/controls/selector/selector.component';
import { CourtineService } from '../../../../global/nav/courtine.service';
import { FormUtil } from '../../../../global/utils/form.util';
import { LoginForm, ProfileService } from '../../../profile.service';
import { HeaderComponent } from '../../../../global/components/header/header.component';
import { DialogService } from '../../../../global/nav/dialog.service';
import { NavService } from '../../../../global/nav/nav.service';
import { LoginComponent } from '../login/login.component';
import { InputComponent } from '../../../../global/controls/input/input.component';
import { Role } from '../../../profile.model';

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
    private dialog: DialogService,
  ) {}

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(6), Validators.required, password()]),
    repassword: new FormControl('', [Validators.required, repassword()]),
  })

  _roleSelectorItems: SelectorItem[] = [{
    code: Role.MANAGER,
    name: 'Manager',
  }, {
    code: Role.ARTIST,
    name: 'Artist'
  }, {
    code: Role.PROMOTOR,
    name: 'Promotor'
  }]

  @HostListener('document:keydown.enter', ['$event'])
  onEnterPress(event: KeyboardEvent) {
    event.preventDefault();
    this._submit()
  }

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
        this.dialog.simplePopup('Registered successfully')
      },
      error: (error) => {
        this.dialog.errorPopup(error.error.message)
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
