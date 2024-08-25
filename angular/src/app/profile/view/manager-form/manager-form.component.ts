import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../global/controls/input/input.component';
import { SelectorComponent } from '../../../global/controls/selector/selector.component';
import { CountriesService } from '../../../global/countries/countries.service';
import { of } from 'rxjs';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { ProfileService } from '../../profile.service';
import { FormUtil } from '../../../global/utils/form.util';
import { Country } from '../../../global/countries/country.model';

@Component({
  selector: 'app-manager-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SelectorComponent,
    BtnComponent,
  ],
  templateUrl: './manager-form.component.html',
  styleUrl: './manager-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ManagerFormComponent {
  
  constructor(
    private readonly countryService: CountriesService,
    private readonly profileService: ProfileService,
  ) {}

  _countryItems = this.countryService.getCountries()

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

  _submit() {
    if (this.form.invalid) {
      FormUtil.markForm(this.form)
      return
    }


  }

}
