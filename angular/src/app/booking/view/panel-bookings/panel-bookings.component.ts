import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { map, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { bookingFormData, loadBookings, profile, profileBookings, removeBookingFormData } from '../../../profile/profile.state';
import { StatusPipe } from '../../../global/pipes/status.pipe';
import { IsArrayPipe } from '../../../global/pipes/is-array.pipe';
import { BookingDto } from '../../services/booking.service';
import { AppState } from '../../../app.state';
import { FormPresentationComponent } from '../../../form-processor/presentation/form-presentation/form-presentation.component';
import { BookingFormStructure } from '../../booking-form-structure';
import { DESKTOP } from '../../../global/services/device';
import { BookingsSectionComponent } from './bookings-section/bookings-section.component';
import { IconButtonComponent } from '../../../global/components/icon-button/icon-button.component';
import { SignComponent } from '../../../global/components/sign/sign.component';

@Component({
  selector: 'app-panel-bookings',
  standalone: true,
  imports: [
    CommonModule,
    IsArrayPipe,
    FormPresentationComponent,
    BookingsSectionComponent,
    StatusPipe,
    IconButtonComponent,
    SignComponent,
],
  templateUrl: './panel-bookings.component.html',
  styleUrl: './panel-bookings.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PanelBookingsComponent {

  readonly DESKTOP = DESKTOP

  constructor(
    private readonly store: Store<AppState>,
  ) {}
  
  _bookingFormStructure = new BookingFormStructure(this.store, [])

  _formData$ = this.store.select(bookingFormData)
  
  _bookings$ = this.store.select(profileBookings).pipe(
    withLatestFrom(this.store.select(profile)),
    map(([bookings, profile]) => {
      this._bookingsAsManager = bookings?.filter(b => b.managerUid === profile?.uid) || []
      this._bookingsAsPromoter = bookings?.filter(b => b.promoterUid === profile?.uid) || []
      this._bookingsAsArtist = bookings?.filter(b => b.artists.map(a => a.code).includes(profile?.artistSignature || '')) || []
      return bookings
    }),
  )

  _bookingsAsManager: BookingDto[] = []
  _bookingsAsPromoter: BookingDto[] = []
  _bookingsAsArtist: BookingDto[] = []

  
  ngOnInit(): void {
    this.store.dispatch(loadBookings())
  }

  _closeBooking() {
    this.store.dispatch(removeBookingFormData())
  }

}
