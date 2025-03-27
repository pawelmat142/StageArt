import { Component, Input, OnInit } from '@angular/core';
import { Token } from '../../../profile/auth/view/token';
import { ButtonModule } from 'primeng/button';
import { BookingDto, BookingService } from '../../services/booking.service';
import { Dialog } from '../../../global/nav/dialog.service';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../global/controls/form-field/form-field.component';
import { InputTextModule } from 'primeng/inputtext';
import { CourtineService } from '../../../global/nav/courtine.service';
import { SubstepComponent } from '../booking-stepper/substep/substep.component';

@Component({
  selector: 'app-booking-form-step',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputTextModule,
    SubstepComponent
  ],
  templateUrl: './booking-form-step.component.html',
  styleUrl: './booking-form-step.component.scss'
})
export class BookingFormStepComponent implements OnInit {
  
  constructor(
    private readonly dialog: Dialog,
    private readonly bookingService: BookingService,
    private readonly courtine: CourtineService,
  ) {}

  ngOnInit(): void {
    this.initForm()
  }

  private initForm() {
    this.form.controls.artistFee.setValue(this.booking.artistFee || '')
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

  _acceptBooking() {
    this.dialog.yesOrNoPopup(`Booking request will be accepted, documents step will be started. Sure?`, true).pipe(
      filter(confirm => confirm),
      tap(() => this.courtine.startCourtine() ),
      switchMap(() => this.bookingService.requestDocuments$({
          formId: this.booking.formId,
          artistFee: this.form.controls.artistFee.value!
      })),
      tap((booking) => {
        this.booking = booking
        this.initForm()
      }),
      catchError(error => {
        this.dialog.errorPopup(error)
        return of(null)
      }),
      tap(() => this.courtine.stopCourtine()),
    ).subscribe()
  }

  _cancelBooking() {
    this.dialog.yesOrNoPopup(`Booking will be cancelled. Are you sure?`, true).pipe(
      filter(confirm => confirm),
      tap(() => this.courtine.startCourtine()),
      switchMap(() => this.bookingService.cancelBooking$(this.booking.formId)),
      tap((booking) => {
        this.booking = booking
        this.initForm()
      }),
      catchError(error => {
        this.dialog.errorPopup(error)
        return of(null)
      }),
      tap(() => this.courtine.stopCourtine()),
    ).subscribe()
  }

  _submit() {
    if (this.form.invalid) {
      return
    }
    this._acceptBooking()
  }

}
