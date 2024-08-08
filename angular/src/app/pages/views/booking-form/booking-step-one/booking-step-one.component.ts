import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../controls/input/input.component';
import { DatesComponent } from "../../../controls/dates/dates.component";
import { TextareaComponent } from "../../../controls/textarea/textarea.component";
import { TextareaElementComponent } from '../../../controls/textarea-element/textarea-element.component';
import { CountriesService } from '../../../../services/countries/countries.service';
import { SelectorComponent, SelectorItem } from '../../../controls/selector/selector.component';

@Component({
  selector: 'app-booking-step-one',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    DatesComponent,
    TextareaComponent,
    TextareaElementComponent,
    SelectorComponent,
],
  templateUrl: './booking-step-one.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BookingStepOneComponent {

  constructor(
    private readonly countriesService: CountriesService,
  ){}

  _countryItems: SelectorItem[] = []

  @Input() form!: FormGroup

  ngOnInit(): void {
    this._countryItems = this.countriesService.getCountries()
  }

}
