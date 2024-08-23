import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { map, Observable, of, shareReplay, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { uid } from '../../../profile/profile.state';
import { StatusPipe } from '../../../global/pipes/status.pipe';
import { FromCamelToTextPipe } from '../../../global/pipes/from-camel.pipe';
import { IsArrayPipe } from '../../../global/pipes/is-array.pipe';
import { Booking, BookingListDto, BookingService } from '../../services/booking.service';
import { AppState } from '../../../app.state';
import { FormPresentationComponent } from '../../../form-processor/presentation/form-presentation/form-presentation.component';
import { BookingFormStructure } from '../../booking-form-structure';
import { DESKTOP } from '../../../global/services/device';

@Component({
  selector: 'app-panel-bookings',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe,
    FromCamelToTextPipe,
    IsArrayPipe,
    FormPresentationComponent,
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

  _bookings$: Observable<BookingListDto[]> = this.bookingService.fetchProfileBookings$().pipe(
    shareReplay(1),
  )

  _bookingsAsManager$ = this._bookings$.pipe(
    withLatestFrom(this.store.select(uid)),
    map(([bookings, uid]) => bookings.filter(b => b.managerUid === 'MOCK TODO'))
    // TODO: only bookings where profile is manager
    // map(([bookings, uid]) => bookings.filter(b => b.managerUid === uid))
  )

  _bookingsAsPromoter$ = this._bookings$.pipe(
    withLatestFrom(this.store.select(uid)),
    map(([bookings, uid]) => bookings.filter(b => b.promoterUid === uid))
  )

  _booking$: Observable<Booking | null> = of(null)

  _openBooking(booking: BookingListDto) {
    this._booking$ = this.bookingService.fetchBooking$(booking.formId).pipe(
      shareReplay()
    )
  }

}
