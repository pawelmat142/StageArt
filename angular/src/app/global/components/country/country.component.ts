import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CountriesService } from '../../countries/countries.service';
import { Country } from '../../countries/country.model';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule, IconButtonComponent],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CountryComponent {

  constructor(
    private readonly countriesService: CountriesService
  ) {}

  @Input() countryCode?: string
  @Input() size = 20

  _country?: Country

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countryCode']) {
      if (this.countryCode) {
        this._country = this.countriesService.findByCode(this.countryCode)
      } else {

      }
    }
  }  
}
