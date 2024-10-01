import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormProcessorComponent } from '../../../form-processor/form-processor/form-processor.component';
import { selectFormId, submittedForm } from '../../../form-processor/form.state';
import { Store } from '@ngrx/store';
import { initArtists } from '../../../artist/artists.state';
import { of, switchMap, withLatestFrom } from 'rxjs';
import { loggedInChange } from '../../../profile/profile.state';
import { BookingService } from '../../../booking/services/booking.service';
import { Dialog, DialogData } from '../../../global/nav/dialog.service';
import { NavService } from '../../../global/nav/nav.service';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { AppState } from '../../../app.state';
import { BookingFormStructure } from '../../booking-form-structure';
import { CountriesService } from '../../../global/countries/countries.service';
import { Path } from '../../../global/nav/path';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormProcessorComponent,
    HeaderComponent,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BookFormComponent {

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: Dialog,
    private readonly nav: NavService,
    private readonly bookingService: BookingService,
    private readonly countriesService: CountriesService,
  ) {}

  _bookingFormStructure = new BookingFormStructure(
    this.store,
    this.countriesService.getCountries()
  )

  ngOnInit(): void {
    this.store.dispatch(initArtists())
  }

  _submit(data: any) {
    this.store.select(loggedInChange).pipe(
      withLatestFrom(this.store.select(selectFormId)),
      switchMap(([loggedIn, formId]) => {
        if (!loggedIn) {
          this.loginPopup()
        } else if (!formId) {
          console.error('no form id')
        } else {
          return this.bookingService.submitForm$(formId)
        }
        return of()
      }),
    ).subscribe({
      next: () => {
        this.store.dispatch(submittedForm())

        // TODO go to form/booking view
        this.nav.home()
        this.dialog.simplePopup('Form submitted')
      },
      error: error => {
        this.dialog.errorPopup(error.error.message)
      }
    })
  }

  public loginPopup(msg?: string) {
    const data: DialogData = {
        header: msg || 'You neeed to log in before submitting the form',
        buttons: [{
            severity: 'secondary',
            label: 'Close',
        }, {
            label: 'To login',
            onclick: () => this.nav.to(Path.LOGIN)
        }]
    }
    return this.dialog.popup(data)
}

}
