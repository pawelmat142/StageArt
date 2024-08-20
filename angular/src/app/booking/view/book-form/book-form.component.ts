import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormProcessorComponent } from '../../../form-processor/form-processor/form-processor.component';
import { selectFormId, submittedForm } from '../../../form-processor/form.state';
import { Store } from '@ngrx/store';
import { initArtists } from '../../../artist/artists.state';
import { of, switchMap, tap, withLatestFrom } from 'rxjs';
import { loggedInChange } from '../../../profile/profile.state';
import { BookingService } from '../../../booking/services/booking.service';
import { DialogService } from '../../../global/nav/dialog.service';
import { NavService } from '../../../global/nav/nav.service';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { AppState } from '../../../app.state';
import { BookingFormStructure } from '../../booking-form-structure';

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
    private readonly dialog: DialogService,
    private readonly nav: NavService,
    private readonly bookingService: BookingService,
  ) {}

  _bookingFormStructure = new BookingFormStructure(this.store)

  ngOnInit(): void {
    this.store.dispatch(initArtists())
    this.findLatestBookingPromoterInfo()
  }

  _initialData?: any

  private findLatestBookingPromoterInfo() {
    this.bookingService.findPromoterInfo$().subscribe({
      next: promoterInfo => {
        if (promoterInfo) {
          this._initialData = { promoterInformation: promoterInfo }
        }
      },
      error: error => this.dialog.errorPopup(error)
    })
  }

  _submit(data: any) {
    this.store.select(loggedInChange).pipe(
      withLatestFrom(this.store.select(selectFormId)),
      switchMap(([loggedIn, formId]) => {
        if (!loggedIn) {
          this.dialog.loginPopup()
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
        this.nav.home()
        // TODO go to form/booking view
        this.dialog.simplePopup('Form submitted')
      },
      error: error => {
        console.error(error)
      }
    })
  }


}
