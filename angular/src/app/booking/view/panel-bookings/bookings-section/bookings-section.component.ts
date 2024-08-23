import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, output, ViewEncapsulation } from '@angular/core';
import { DESKTOP } from '../../../../global/services/device';
import { BookingPanelDto } from '../../../services/booking.service';
import { StatusPipe } from "../../../../global/pipes/status.pipe";

@Component({
  selector: 'app-bookings-section',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe
],
  templateUrl: './bookings-section.component.html',
  styleUrl: './bookings-section.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BookingsSectionComponent {

  readonly DESKTOP = DESKTOP

  @Input() header: string = 'header'

  @Input() bookings!: BookingPanelDto[]

  @Output() openBooking = new EventEmitter<BookingPanelDto>()


}
