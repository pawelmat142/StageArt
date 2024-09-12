import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { DESKTOP } from '../../../../global/services/device';
import { BookingDto, BookingService } from '../../../services/booking.service';
import { StatusPipe } from "../../../../global/pipes/status.pipe";
import { AccordionModule } from 'primeng/accordion';
import { BtnComponent } from '../../../../global/controls/btn/btn.component';
import { DialogService } from '../../../../global/nav/dialog.service';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { selectBooking, uid, unselectBooking } from '../../../../profile/profile.state';
import { IconButtonComponent } from '../../../../global/components/icon-button/icon-button.component';
import { DocumentService } from '../../../../global/document/document.service';
import { Template } from '../../../../global/document/doc-util';
import { NamesPipe } from "../../../../global/pipes/names.pipe";
import { BookingStepperComponent } from '../../booking-stepper/booking-stepper.component';

@Component({
  selector: 'app-bookings-section',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe,
    AccordionModule,
    BtnComponent,
    IconButtonComponent,
    NamesPipe,
    BookingStepperComponent,
],
  templateUrl: './bookings-section.component.html',
  styleUrl: './bookings-section.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BookingsSectionComponent {

  readonly DESKTOP = DESKTOP

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
