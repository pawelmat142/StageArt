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
import { of, switchMap, tap } from 'rxjs';
import { IconButtonComponent } from '../../../../global/components/icon-button/icon-button.component';
import { DocumentService } from '../../../../global/document/document.service';
import { Template } from '../../../../global/document/doc-util';
import { NamesPipe } from "../../../../global/pipes/names.pipe";

@Component({
  selector: 'app-bookings-section',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe,
    AccordionModule,
    BtnComponent,
    IconButtonComponent,
    NamesPipe
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
    private readonly documentService: DocumentService,
    private readonly store: Store<AppState>,
  ) {}

  _profileUid$ = this.store.select(uid)

  @Input() header: string = 'header'

  @Input() bookings!: BookingDto[]

  @Output() openBooking = new EventEmitter<BookingDto>()
  @Output() refreshBookings = new EventEmitter<BookingDto>()

  _selectBooking(index: number | number[]) {
    if (typeof index === 'number') {
      const selectedBooking = this.bookings[index]
      this.store.dispatch(selectBooking(selectedBooking))
    } else {
        this.store.dispatch(unselectBooking())
    }
  }

  _cancelBooking(booking: BookingDto) {
    this.dialog.yesOrNoPopup(`Booking will be cancelled. Are you sure?`).pipe(
      switchMap(confirm => confirm 
        ? this.bookingService.cancelBooking$(booking.formId).pipe(
          tap(booking => {
            this.refreshBookings.emit(booking)}))
        : of()
      ),
    ).subscribe()
  }

  _acceptBooking(booking: BookingDto) {
    this.dialog.yesOrNoPopup(`Generate documents and request sign?`).pipe(
      switchMap(confirm => confirm 
        ? this.bookingService.requestDocuments$(booking.formId).pipe(
          tap(booking => {
            this.refreshBookings.emit(booking)}))
        : of()
      ),
    ).subscribe()
  }

  _getPdf(booking: BookingDto, template: Template) {
    this.documentService.getPdf(booking.formId, template)
  }

  _signContract(booking: BookingDto) {
    this.documentService.signContract(booking.formId)
  }

}
