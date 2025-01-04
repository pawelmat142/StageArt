import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map, tap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { BookingFormStructure } from '../../booking-form-structure';
import { SignComponent } from '../../../global/components/sign/sign.component';
import { $desktop } from '../../../global/tools/media-query';
import { MockCardComponent } from '../../../global/components/mock-card/mock-card.component';
import { BookingsSectionComponent } from './bookings-section/bookings-section.component';
import { loadBookings, profile, profileBookings } from '../../../profile/profile.state';

@Component({
  selector: 'app-panel-bookings',
  standalone: true,
  imports: [
    CommonModule,
    SignComponent,
    MockCardComponent,
    BookingsSectionComponent
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

}
