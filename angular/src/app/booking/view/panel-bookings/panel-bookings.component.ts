import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { map, Observable, of, shareReplay, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { profile, uid } from '../../../profile/profile.state';
import { StatusPipe } from '../../../global/pipes/status.pipe';
import { IsArrayPipe } from '../../../global/pipes/is-array.pipe';
import { BookingDto, BookingService } from '../../services/booking.service';
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
    private readonly bookingService: BookingService,
    private readonly store: Store<AppState>,
  ) {}
  
  _bookingFormStructure = new BookingFormStructure(this.store, [])
  
  _bookings$: Observable<BookingDto[]> = of([])

  _bookingsAsManager: BookingDto[] = []
  _bookingsAsPromoter: BookingDto[] = []
  _bookingsAsArtist: BookingDto[] = []

  _formData$?: Observable<any>
  
  ngOnInit(): void {
    this.fetchBookings()
  }

  private fetchBookings() {
    this._bookings$ = this.bookingService.fetchProfileBookings$().pipe(
      withLatestFrom(this.store.select(profile)),
      map(([bookings, profile]) => {
        this._bookingsAsManager = bookings.filter(b => b.managerUid === profile?.uid)
        this._bookingsAsPromoter = bookings.filter(b => b.promoterUid === profile?.uid)
        this._bookingsAsArtist = bookings.filter(b => b.artists.map(a => a.code).includes(profile?.artistSignature || ''))
        return bookings
      }),
    )
  }
  

  _openFormData(booking: BookingDto) {
    this._formData$ = this.bookingService.fetchFormData$(booking.formId).pipe(
      shareReplay()
    )
  }

  _refreshBookings(booking: BookingDto) {
    this.fetchBookings()
  }

  _closeBooking() {
    this._formData$ = undefined
  }

}
