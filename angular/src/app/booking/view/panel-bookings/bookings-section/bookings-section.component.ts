import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BookingDto } from '../../../services/booking.service';
import { StatusPipe } from "../../../../global/pipes/status.pipe";
import { AccordionModule } from 'primeng/accordion';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { bookingsBreadcrumb, selectBooking, setBookingsBreadcrumb, uid, unselectBooking } from '../../../../profile/profile.state';
import { NamesPipe } from "../../../../global/pipes/names.pipe";
import { BookingStepperComponent } from '../../booking-stepper/booking-stepper.component';
import { $desktop } from '../../../../global/tools/media-query';
import { BookingFormDataComponent } from '../booking-form-data/booking-form-data.component';
import { MenuItem } from 'primeng/api';
import { BreadcrumbUtil } from '../../../breadcrumb.util';

@Component({
  selector: 'app-bookings-section',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe,
    AccordionModule,
    NamesPipe,
],
  templateUrl: './bookings-section.component.html',
  styleUrl: './bookings-section.component.scss',
})
export class BookingsSectionComponent implements OnInit {

  readonly $desktop = $desktop;

  constructor(
    private readonly store: Store<AppState>,
  ) {}

  _profileUid$ = this.store.select(uid)

  @Input() header: string = 'header'

  @Input() bookings!: BookingDto[]

  ngOnInit(): void {
    this.setBookingsBreadcrumb()
  }
  
  private setBookingsBreadcrumb() {
    this.store.dispatch(setBookingsBreadcrumb({ value: BreadcrumbUtil.bookings() }))
  }

  _selectBooking(index: number) {
    const selectedBooking = this.bookings[index]
    this.store.dispatch(selectBooking(selectedBooking))
  }

}
