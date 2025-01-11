import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { CountryComponent } from '../../../../global/components/country/country.component';
import { artistCountry, artistName, editMode, updateCountry, updateName } from '../artist-view.state';
import { FormsModule } from '@angular/forms';
import { CountriesService } from '../../../../global/countries/countries.service';
import { Observable, tap } from 'rxjs';
import { StyleComponent } from '../style/style.component';
import { ArtistService } from '../../../artist.service';
import { SelectorItem } from '../../../../global/interface';
import { DropdownComponent } from "../../../../global/controls/dropdown/dropdown.component";
import { $desktop } from '../../../../global/tools/media-query';

@Component({
  selector: 'app-name',
  standalone: true,
  imports: [
    CommonModule,
    CountryComponent,
    FormsModule,
    StyleComponent,
    DropdownComponent
],
  templateUrl: './name.component.html',
  styleUrl: './name.component.scss'
})
export class NameComponent {
  
  readonly $desktop = $desktop
  
  constructor(
    private readonly countriesService: CountriesService,
    private readonly artistService: ArtistService,
    private readonly store: Store<AppState>,
  ) {}

  @ViewChild('nameInput') nameInput?: ElementRef

  _countryItems$!: Observable<SelectorItem[]>

  ngOnInit(): void {
    this._countryItems$ = this.countriesService.countries$
  }

  _editable$ = this.artistService.artistViewEditable$

  _editMode = false
  
  _editMode$ = this.store.select(editMode).pipe(
    tap(mdoe => {
      this._editMode = mdoe
      if (!mdoe) {
        this._editName = false
      }
    })
  )

  _editName = false

  _name$ = this.store.select(artistName).pipe(
  )

  _country$ = this.store.select(artistCountry).pipe(
  )


  editName() {
    this._editName = !this._editName
    if (this._editName) {
      setTimeout(() => {
        this.nameInput?.nativeElement.focus()
      }, 100)
    }
  }



  _selectCountry(item: SelectorItem) {
    this.store.dispatch(updateCountry({ value: item }))
  }

  _nameChange($event: Event) {
    const target = $event.target as HTMLInputElement
    this.store.dispatch(updateName({ value: target.value }))
  }

}
