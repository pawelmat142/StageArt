import { Component, OnInit } from '@angular/core';
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
import { filter, from, map, mergeMap, Observable, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';
import { SelectorItem } from '../../../interface';
import { formData, FormType, setFormData, startForm } from '../../../../form-processor/form.state';
import { NavService } from '../../../nav/nav.service';
import { Path } from '../../../nav/path';
import { FormUtil } from '../../../utils/form.util';
import { BookingService } from '../../../../booking/services/booking.service';
import { ArtistTimelineService } from '../../../../booking/services/artist-timeline.service';
import { TimelineUtil } from '../../../utils/timeline.util';

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
export class HomepageFormComponent implements OnInit {

  constructor(
    private readonly countryService: CountriesService,
    private readonly store: Store<AppState>,
    private readonly nav: NavService,
    private readonly bookingService: BookingService,
    private readonly artistTimelineService: ArtistTimelineService,
  ) {}

  form = new FormGroup({
    artist: new FormControl<SelectorItem | null>(null, Validators.required),
    country: new FormControl<SelectorItem | null>(null, Validators.required),
    date: new FormControl<Date | undefined>(undefined, Validators.required),
  })

  get f() { return this.form.controls }

  _countryItems = this.countryService.getCountries()

  _artistItems$ = this.store.select(selectArtists).pipe(map(a => ArtistUtil.selectorItems(a)))

  _disabledDates: Date[] = []

  readonly _tommorow = TimelineUtil.tommorow()

  ngOnInit(): void {
    this.form.controls.artist.valueChanges.pipe(
      mergeMap((artist) => this.updateDisabledDates$(artist)),
    ).subscribe()
  }
  
  _submit() {
    if (this.form?.invalid) {
      FormUtil.markForm(this.form)
      return
    }
    const { artist, country, date } = this.form.value
    const performanceStartDate = date ? new Date(date) : undefined
    const dataToPrefill = {
      eventInformation: {
        performanceStartDate,
        eventCountry: country,
      },
      artistInformation: {
        artist: artist
      },
      promoterInformation: undefined
    }
    this.nav.logInBeforePopup().pipe(
      switchMap(result => {
        if (result === true) {
          return this.prefillBookForm$(dataToPrefill).pipe(map(()=> {
            this.nav.to(Path.LOGIN)
          }))
        } 
        else if (result === false) {
          return of()
        } 
        else {
          return this.prefillBookForm$(dataToPrefill).pipe(map(() => {
            this.nav.bookNow()
          }))
        }
      }),
    ).subscribe()
  }

  private prefillBookForm$(dataToPrefill: any): Observable<void> {
    return this.bookingService.findPromoterInfo$().pipe(
      withLatestFrom(this.store.select(formData)),
      map(([promoterInfo, currentFormData]) => {
        const formData = currentFormData ? JSON.parse(JSON.stringify(currentFormData)) : {}
        if (promoterInfo) {
          formData.promoterInformation = promoterInfo
        }
        if (dataToPrefill?.artistInformation) {
          formData.artistInformation = dataToPrefill?.artistInformation
        }
        if (dataToPrefill?.eventInformation) {
          formData.eventInformation = dataToPrefill.eventInformation
        }
        localStorage.removeItem(FormType.BOOKING) // skip load already opened form state
        this.store.dispatch(setFormData(formData))
      }),
    )
  }

  private updateDisabledDates$(artist: SelectorItem | null): Observable<void> {
    if (!artist) {
      this._disabledDates = []
      return of()
    }
    return this.artistTimelineService.artistTimeline$(artist.code)
      .pipe(map(timeline => {this._disabledDates = TimelineUtil.getDisabledDates(timeline)}))
  }
}