import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, output, ViewEncapsulation } from '@angular/core';
import { DESKTOP } from '../../../../global/services/device';
import { BookingPanelDto, BookingService } from '../../../services/booking.service';
import { StatusPipe } from "../../../../global/pipes/status.pipe";
import { AccordionModule } from 'primeng/accordion';
import { BtnComponent } from '../../../../global/controls/btn/btn.component';
import { DialogService } from '../../../../global/nav/dialog.service';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { uid } from '../../../../profile/profile.state';

@Component({
  selector: 'app-bookings-section',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe,
    AccordionModule,
    BtnComponent,
],
  templateUrl: './bookings-section.component.html',
  styleUrl: './bookings-section.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BookingsSectionComponent {

  readonly DESKTOP = DESKTOP

  constructor(
    private readonly dialog: DialogService,
    private readonly bookingService: BookingService,
    private readonly store: Store<AppState>,
  ) {}

  _profileUid$ = this.store.select(uid)

  @Input() header: string = 'header'

  @Input() bookings!: BookingPanelDto[]

  @Output() openBooking = new EventEmitter<BookingPanelDto>()

  _cancelBooking(booking: BookingPanelDto) {
    console.log(booking)
  }
  
  _acceptBooking(booking: BookingPanelDto) {
    console.log(booking)
  }


}
