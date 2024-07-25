import { Component } from '@angular/core';
import { InputComponent } from '../../../form/input/input.component';
import { ButtonComponent } from '../../../form/button/button.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header.component';
import { SelectorComponent, SelectorItem } from '../../../form/selector/selector.component';
import { CountriesService } from '../../../../services/countries/countries.service';
import { countryValidator } from '../../../../services/countries/countries.validator';


@Component({
  selector: 'app-add-artist',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    HeaderComponent,
    SelectorComponent,
],
  templateUrl: './add-artist.component.html',
  styleUrl: './add-artist.component.scss'
})
export class AddArtistComponent {

  constructor(
    private readonly countriesService: CountriesService,
  ) {}

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    country: new FormControl('', [countryValidator(this.countriesService)]),
    test: new FormControl(''),
  })

  get f() { return this.form.controls }

  ngOnInit() {
    this._countryItems = this.countriesService.getCountries().map(c => {
      return {
        code: c.name,
        label: c.name,
        imgUrl: c.flagUrl
      }
    })
  }

  submit() {
    console.log(this.form)
  }

  _countryItems: SelectorItem[] = []

}
