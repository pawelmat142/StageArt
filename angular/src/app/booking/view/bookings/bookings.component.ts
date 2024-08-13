import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BookingListDto, BookingService } from '../../../services/booking/booking.service';
import { map, Observable, shareReplay, tap, withLatestFrom } from 'rxjs';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import { uid } from '../../../auth/profile.state';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent {

  constructor(
    private readonly bookingService: BookingService,
    private readonly store: Store<AppState>,
  ) {}

  _bookings$: Observable<BookingListDto[]> = this.bookingService.fetchProfileBookings$().pipe(
    tap(console.log),
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


}
