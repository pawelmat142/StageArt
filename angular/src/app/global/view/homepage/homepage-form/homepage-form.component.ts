import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../controls/form-field/form-field.component';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CountriesService } from '../../../countries/countries.service';
import { DropdownComponent } from '../../../controls/dropdown/dropdown.component';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { selectArtists } from '../../../../artist/artists.state';
import { ArtistUtil } from '../../../../artist/artist.util';
import { map } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-homepage-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    
    FormFieldComponent,
    InputTextModule,
    DropdownComponent,
    ButtonModule,
    CalendarModule,
  ],
  templateUrl: './homepage-form.component.html',
  styleUrl: './homepage-form.component.scss'
})
export class HomepageFormComponent {

  constructor(
    private readonly countryService: CountriesService,
    private readonly store: Store<AppState>,
  ) {}

  form = new FormGroup({
    artist: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    date: new FormControl<Date | undefined>(undefined, Validators.required),
  })


  get f() { return this.form.controls }

  _countryItems = this.countryService.getCountries()

  _artistItems$ = this.store.select(selectArtists).pipe(map(a => ArtistUtil.selectorItems(a)))

  _submit() {
    console.log(this.form.controls)
    console.log(this.form.controls.date.value)
    console.log(typeof this.form.controls.date.value)
    console.log(this.form.controls.date.value instanceof Date)
    console.log('TODO: submit homepage form')
  }

}
