import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { map, Observable, of, shareReplay, take, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { profile, uid } from '../../../profile/profile.state';
import { StatusPipe } from '../../../global/pipes/status.pipe';
import { IsArrayPipe } from '../../../global/pipes/is-array.pipe';
import { Booking, BookingPanelDto, BookingService } from '../../services/booking.service';
import { AppState } from '../../../app.state';
import { FormPresentationComponent } from '../../../form-processor/presentation/form-presentation/form-presentation.component';
import { BookingFormStructure } from '../../booking-form-structure';
import { DESKTOP } from '../../../global/services/device';
import { BookingsSectionComponent } from './bookings-section/bookings-section.component';
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
  
  _bookings$: Observable<BookingPanelDto[]> = of([])

  _bookingsAsManager: BookingPanelDto[] = []
  _bookingsAsPromoter: BookingPanelDto[] = []
  _bookingsAsArtist: BookingPanelDto[] = []

  _booking$?: Observable<Booking>
  
  ngOnInit(): void {
    this.fetchBookings()
  }

  private fetchBookings() {
    this._bookings$ = this.bookingService.fetchProfileBookings$().pipe(
      withLatestFrom(this.store.select(profile)),
      map(([bookings, profile]) => {
        this._bookingsAsManager = bookings.filter(b => b.managerUid === profile?.uid)
        this._bookingsAsPromoter = bookings.filter(b => b.promoterUid === profile?.uid)
        this._bookingsAsArtist = bookings.filter(b => b.artistSignatures.includes(profile?.artistSignature || ''))
        return bookings
      }),
    )
  }
  

  _openBooking(booking: BookingPanelDto) {
    this._booking$ = this.bookingService.fetchBooking$(booking.formId).pipe(
      shareReplay()
    )
  }

  _refreshBookings(booking: BookingPanelDto) {
    this.fetchBookings()
  }

  _closeBooking() {
    this._booking$ = undefined
  }

}
