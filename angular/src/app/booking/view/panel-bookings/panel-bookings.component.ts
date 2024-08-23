import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { map, Observable, shareReplay, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { uid } from '../../../profile/profile.state';
import { StatusPipe } from '../../../global/pipes/status.pipe';
import { IsArrayPipe } from '../../../global/pipes/is-array.pipe';
import { Booking, BookingPanelDto, BookingService } from '../../services/booking.service';
import { AppState } from '../../../app.state';
import { FormPresentationComponent } from '../../../form-processor/presentation/form-presentation/form-presentation.component';
import { BookingFormStructure } from '../../booking-form-structure';
import { DESKTOP } from '../../../global/services/device';
import { BookingsSectionComponent } from './bookings-section/bookings-section.component';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { IconButtonComponent } from '../../../global/components/icon-button/icon-button.component';

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
],
  templateUrl: './panel-bookings.component.html',
  styleUrl: './panel-bookings.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PanelBookingsComponent {

  readonly DESKTOP = DESKTOP

  constructor(
    private readonly bookingService: BookingService,
    private readonly store: Store<AppState>,
  ) {}
  
  _bookingFormStructure = new BookingFormStructure(this.store, [])
  

  _bookings$: Observable<BookingPanelDto[]> = this.bookingService.fetchProfileBookings$().pipe(
    shareReplay(1),
  )

  _bookingsAsManager$ = this._bookings$.pipe(
    withLatestFrom(this.store.select(uid)),
    map(([bookings, uid]) => bookings.filter(b => b.managerUid === uid)),
  )
  
  _bookingsAsPromoter$ = this._bookings$.pipe(
    withLatestFrom(this.store.select(uid)),
    map(([bookings, uid]) => bookings.filter(b => b.promoterUid === uid)),
  )
  
  _bookingsAsArtist$ = this._bookings$.pipe(
    withLatestFrom(this.store.select(store => store.profileState.profile?.artistSignature)),
    map(([bookings, artistSignature]) => bookings.filter(b => b.artistSignatures.includes(artistSignature!))),
  )

  _booking$?: Observable<Booking>

  _openBooking(booking: BookingPanelDto) {
    this._booking$ = this.bookingService.fetchBooking$(booking.formId).pipe(
      shareReplay()
    )
  }

  _closeBooking() {
    this._booking$ = undefined
  }

}
