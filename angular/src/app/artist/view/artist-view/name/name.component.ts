import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { CountryComponent } from '../../../../global/components/country/country.component';
import { artistCountry, artistName, editMode, profileIsOwner, updateCountry, updateName } from '../artist-view.state';
import { FormsModule } from '@angular/forms';
import { SelectorItemsComponent } from '../../../../global/controls/selector/selector-items/selector-items.component';
import { SelectorItem } from '../../../../global/controls/selector/selector.component';
import { CountriesService } from '../../../../global/countries/countries.service';

@Component({
  selector: 'app-name',
  standalone: true,
  imports: [
    CommonModule,
    CountryComponent,
    FormsModule,
    SelectorItemsComponent
  ],
  templateUrl: './name.component.html',
  styleUrl: './name.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NameComponent {

  constructor(
    private readonly countriesService: CountriesService,
    private readonly store: Store<AppState>
  ) {}


  _countryItems: SelectorItem[] = []

  ngOnInit(): void {
    this._countryItems = this.countriesService.getCountries()
  }

  _editable$ = this.store.select(profileIsOwner)

  _editMode$ = this.store.select(editMode)

  _editName = false

  _name$ = this.store.select(artistName).pipe(
  )

  _countryCode$ = this.store.select(artistCountry).pipe(
  )


  editName() {
    this._editName = !this._editName
  }

  _editCountry = false

  editCountry() {
    this._editCountry = true
  }


  _selectCountry(item: SelectorItem) {
    this.store.dispatch(updateCountry({ value: item.code }))
    this._editCountry = false
  }


  _nameChange($event: Event) {
    const target = $event.target as HTMLInputElement
    this.store.dispatch(updateName({ value: target.value }))
  }

}
