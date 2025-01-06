import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BookingDto } from '../../../services/booking.service';
import { BookingFormDataComponent } from '../booking-form-data/booking-form-data.component';
import { BookingStepperComponent } from '../../booking-stepper/booking-stepper.component';
import { StatusPipe } from "../../../../global/pipes/status.pipe";

@Component({
  selector: 'app-booking-panel-item',
  standalone: true,
  imports: [
    CommonModule,
    BookingFormDataComponent,
    BookingStepperComponent,
    StatusPipe
],
  templateUrl: './booking-panel-item.component.html',
  styleUrl: './booking-panel-item.component.scss'
})
export class BookingPanelItemComponent {

  @Input() booking!: BookingDto

}
