import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { BookingFormStructure } from '../../booking-form-structure';
import { SignComponent } from '../../../global/components/sign/sign.component';
import { $desktop } from '../../../global/tools/media-query';
import { MockCardComponent } from '../../../global/components/mock-card/mock-card.component';
import { BookingsSectionComponent } from './bookings-section/bookings-section.component';
import { bookingsBreadcrumb, loadBookings, profile, profileBookings, selectBooking, unselectBooking } from '../../../profile/profile.state';
import { BookingDto } from '../../services/booking.service';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BookingPanelItemComponent } from './booking-panel-item/booking-panel-item.component';

@Component({
  selector: 'app-panel-bookings',
  standalone: true,
  imports: [
    CommonModule,
    SignComponent,
    MockCardComponent,
    BookingsSectionComponent,
    BreadcrumbModule,
    BookingPanelItemComponent
],
  templateUrl: './panel-bookings.component.html',
  styleUrl: './panel-bookings.component.scss',
})
export class PanelBookingsComponent implements OnInit, OnDestroy {

  readonly $desktop = $desktop;

  constructor(
    private readonly store: Store<AppState>,
  ) {}

  @Input() booking?: BookingDto
  
  _breadcrumb$ = this.store.select(bookingsBreadcrumb)

  ngOnInit(): void {
    this.store.select(state => state.profileState.selectedBooking)
      .subscribe(b => this._selectedBooking = b)
    if (this.booking) {
      this.store.dispatch(selectBooking(this.booking))
      this._emptyBookings = false
    } else {
      this.store.dispatch(loadBookings())
    }
  }
  
  ngOnDestroy(): void {
    this.store.dispatch(unselectBooking())
  }

  _selectedBooking?: BookingDto

  _bookingFormStructure = new BookingFormStructure(this.store, [])

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

}
