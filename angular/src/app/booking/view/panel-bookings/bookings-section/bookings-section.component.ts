import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BookingDto } from '../../../services/booking.service';
import { StatusPipe } from "../../../../global/pipes/status.pipe";
import { AccordionModule } from 'primeng/accordion';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { selectBooking, uid, unselectBooking } from '../../../../profile/profile.state';
import { NamesPipe } from "../../../../global/pipes/names.pipe";
import { BookingStepperComponent } from '../../booking-stepper/booking-stepper.component';
import { $desktop } from '../../../../global/tools/media-query';

@Component({
  selector: 'app-bookings-section',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe,
    AccordionModule,
    NamesPipe,
    BookingStepperComponent,
],
  templateUrl: './bookings-section.component.html',
  styleUrl: './bookings-section.component.scss',
})
export class BookingsSectionComponent {

  readonly $desktop = $desktop;

  constructor(
    private readonly store: Store<AppState>,
  ) {}

  _profileUid$ = this.store.select(uid)

  @Input() header: string = 'header'

  @Input() bookings!: BookingDto[]

  _selectBooking(index: number | number[]) {
    if (typeof index === 'number') {
      const selectedBooking = this.bookings[index]
      this.store.dispatch(selectBooking(selectedBooking))
    } else {
        setTimeout(() => {
          this.store.dispatch(unselectBooking())
        }, 300)
    }
  }

}
