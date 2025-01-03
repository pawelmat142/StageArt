import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { bookingFormData, loadBookings, profile, profileBookings, removeBookingFormData } from '../../../profile/profile.state';
import { AppState } from '../../../app.state';
import { FormPresentationComponent } from '../../../form-processor/presentation/form-presentation/form-presentation.component';
import { BookingFormStructure } from '../../booking-form-structure';
import { BookingsSectionComponent } from './bookings-section/bookings-section.component';
import { IconButtonComponent } from '../../../global/components/icon-button/icon-button.component';
import { SignComponent } from '../../../global/components/sign/sign.component';
import { $desktop } from '../../../global/tools/media-query';
import { MockCardComponent } from '../../../global/components/mock-card/mock-card.component';

@Component({
  selector: 'app-panel-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormPresentationComponent,
    BookingsSectionComponent,
    IconButtonComponent,
    SignComponent,
    MockCardComponent
],
  templateUrl: './panel-bookings.component.html',
  styleUrl: './panel-bookings.component.scss',
})
export class PanelBookingsComponent {

  readonly $desktop = $desktop;

  constructor(
    private readonly store: Store<AppState>,
  ) {}
  
  _bookingFormStructure = new BookingFormStructure(this.store, [])

  _formData$ = this.store.select(bookingFormData)

  _emptyBookings = true
  
  _bookingsForRoles$ = this.store.select(profileBookings).pipe(
    withLatestFrom(this.store.select(profile)),
    map(([bookings, profile]) => {
      return {
        manager: bookings?.filter(b => b.managerUid === profile?.uid) || [],
        promoter: bookings?.filter(b => b.promoterUid === profile?.uid) || [],
        artist: bookings?.filter(b => b.artists.map(a => a.code).includes(profile?.artistSignature || '')) || []
      }
    }),
    tap(bookingsForRoles => this._emptyBookings = ![
      ...bookingsForRoles.artist,
      ...bookingsForRoles.manager,
      ...bookingsForRoles.promoter,
    ].length)
  )

  ngOnInit(): void {
    this.store.dispatch(loadBookings())
  }

  _closeBooking() {
    this.store.dispatch(removeBookingFormData())
  }

}
