import { Component, Input, OnInit } from '@angular/core';
import { Token } from '../../../profile/auth/view/token';
import { ButtonModule } from 'primeng/button';
import { BookingDto, BookingService } from '../../services/booking.service';
import { Dialog } from '../../../global/nav/dialog.service';
import { of, switchMap, tap } from 'rxjs';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { loadBookings } from '../../../profile/profile.state';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../global/controls/form-field/form-field.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-booking-form-step',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputTextModule,
  ],
  templateUrl: './booking-form-step.component.html',
  styleUrl: './booking-form-step.component.scss'
})
export class BookingFormStepComponent implements OnInit {
  
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: Dialog,
    private readonly bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    if (['SUBMITTED'].includes(this.booking.status) 
      && [this.booking.managerUid].includes(this._uid)) {
        this.form.controls.artistFee.setValidators(Validators.required)
    } else {
      this.form.controls.artistFee.disable()
    }
  }

  _uid = Token.getUid()

  @Input() booking!: BookingDto

  form = new FormGroup({
    artistFee: new FormControl('')
  })

  _acceptBooking(booking: BookingDto) {
    this.dialog.yesOrNoPopup(`Booking request will be accepted, documents step will be started. Sure?`, true).pipe(
      switchMap(confirm => confirm 
        ? this.bookingService.requestDocuments$({
          formId: booking.formId,
          artistFee: this.form.controls.artistFee.value!
        }).pipe(
          tap(booking => {
            this.store.dispatch(loadBookings())
          }))
        : of()
      ),
    ).subscribe()
  }

  _cancelBooking(booking: BookingDto) {
    this.dialog.yesOrNoPopup(`Booking will be cancelled. Are you sure?`, true).pipe(
      switchMap(confirm => confirm 
        ? this.bookingService.cancelBooking$(booking.formId).pipe(
          tap(booking => {
            this.store.dispatch(loadBookings())
          }))
        : of()
      ),
    ).subscribe()
  }

  _submit() {
    if (this.form.invalid) {
      return
    }


    console.log('submit')
  }

}
