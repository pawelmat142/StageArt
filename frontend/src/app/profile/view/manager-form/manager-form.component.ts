import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountriesService } from '../../../global/countries/countries.service';
import { ProfileService } from '../../profile.service';
import { FormUtil } from '../../../global/utils/form.util';
import { Country } from '../../../global/countries/country.model';
import { CourtineService } from '../../../global/nav/courtine.service';
import { Dialog } from '../../../global/nav/dialog.service';
import { NavService } from '../../../global/nav/nav.service';
import { Observable, take } from 'rxjs';
import { Path } from '../../../global/nav/path';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormFieldComponent } from '../../../global/controls/form-field/form-field.component';
import { DropdownComponent } from '../../../global/controls/dropdown/dropdown.component';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { setBookingsBreadcrumb } from '../../profile.state';

export interface ManagerData {
  agencyName: string
  agencyCompanyName: string
  nameOfBank: string
  accountHolder: string
  agencyCountry: Country
  accountAddress: string
  accountNumber: string
  accountSwift: string
  agencyEmail: string
  agencyPhone: string
}

@Component({
  selector: 'app-manager-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
    FormFieldComponent,
    InputTextModule,
    ButtonModule,
    DropdownComponent,
  ],
  templateUrl: './manager-form.component.html',
  styleUrl: './manager-form.component.scss',
})
export class ManagerFormComponent {
  
  constructor(
    private readonly countryService: CountriesService,
    private readonly profileService: ProfileService,
    private readonly courtine: CourtineService,
    private readonly dialog: Dialog,
    private readonly nav: NavService,
    private readonly store: Store<AppState>,
  ) {}

  _countryItems$: Observable<Country[]> = this.countryService.countries$

  form = new FormGroup({
    agencyName: new FormControl('', Validators.required),
    agencyCompanyName: new FormControl('', Validators.required),
    nameOfBank: new FormControl('', Validators.required),
    accountHolder: new FormControl('', Validators.required),
    agencyCountry: new FormControl<Country | undefined>(undefined, Validators.required),
    accountAddress: new FormControl('', Validators.required),
    accountNumber: new FormControl('', Validators.required),
    accountSwift: new FormControl('', Validators.required),
    agencyEmail: new FormControl('', Validators.required),
    agencyPhone: new FormControl('', Validators.required),
  })

  ngOnInit(): void {
    this.store.dispatch(setBookingsBreadcrumb({ value: [] }))
    this.loadManagerDataForm()
  }

  _submit() {
    if (this.form.invalid) {
      FormUtil.markForm(this.form)
      return
    }
    this.courtine.startCourtine()
    this.profileService.setManagerData$(this.form.value as ManagerData).pipe(
    ).subscribe({
      next: data => {
        this.courtine.stopCourtine()
        this.dialog.simplePopup('Manager data updated')
        this.nav.to(Path.PANEL)
      }, 
      error: error => {
        this.courtine.stopCourtine()
        this.dialog.errorPopup(error)
      }
    })
  }

  private loadManagerDataForm() {
    this.courtine.startCourtine()
    this.profileService.fetchManagerData$().pipe(
      take(1),
    ).subscribe({
      next: data => {
        this.courtine.stopCourtine()
        if (data) this.form.setValue(data)
      },
      error: error => {
        this.courtine.stopCourtine()
        this.dialog.errorPopup(error)
      } 
    })
  }

}
