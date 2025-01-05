import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BookingDto, BookingService } from '../../../services/booking.service';
import { AccordionModule } from 'primeng/accordion';
import { FormPresentationComponent } from '../../../../form-processor/presentation/form-presentation/form-presentation.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { BookingFormStructure } from '../../../booking-form-structure';
import { tap } from 'rxjs';
import { removeBookingFormData, setBookingFormData } from '../../../../profile/profile.state';

@Component({
  selector: 'app-booking-form-data',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    FormPresentationComponent,
  ],
  templateUrl: './booking-form-data.component.html',
  styleUrl: './booking-form-data.component.scss'
})
export class BookingFormDataComponent implements OnChanges{

  constructor(
    private readonly store: Store<AppState>,
    private readonly bookingService: BookingService,
  ) {}

  @Input() booking!: BookingDto

  _bookingFormStructure = new BookingFormStructure(this.store, [])

  _formData: any = null
  
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.booking) {
      this.close()
    }
  }

  _header = 'Show booking form data'

  _toggleFormData(event: any, booking: BookingDto) {
    const open = Number.isInteger(event)
    if (open && this.booking) {
      this.fetchFormData(this.booking)
      this._header = 'Hide booking form data'
    } else {
      this._header = 'Show booking form data'
      this.close()
    }
  }

  private fetchFormData(booking: BookingDto) {
      this.bookingService.fetchFormData$(booking.formId).pipe(
        tap(formData => {
          if (formData) {
            this.store.dispatch(setBookingFormData(formData))
            this._formData = formData
          } else {
            this.close()
          }
        })
      ).subscribe()
  }

  close() {
    this.store.dispatch(removeBookingFormData())
    this._formData = null
  }

}
