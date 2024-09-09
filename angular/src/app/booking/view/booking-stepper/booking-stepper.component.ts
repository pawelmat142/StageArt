import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { BookingDto, BookingService } from '../../services/booking.service';
import { Template } from '../../../global/document/doc-util';
import { DocumentService } from '../../../global/document/document.service';
import { tap } from 'rxjs';
import { setBookingFormData } from '../../../profile/profile.state';
import { SubstepComponent } from './substep/substep.component';
import { BookingUtil } from '../../booking.util';
import { CommonModule } from '@angular/common';
import { ContractSubstepComponent } from './contract-substep/contract-substep.component';

@Component({
  selector: 'app-booking-stepper',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule, StepperModule,
    BtnComponent,
    MatIconModule,
    MatTooltipModule,
    SubstepComponent,
    ContractSubstepComponent,
  ],
  templateUrl: './booking-stepper.component.html',
  styleUrl: './booking-stepper.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BookingStepperComponent {

  constructor(
    private readonly store: Store<AppState>,
    private readonly bookingService: BookingService,
    private readonly documentService: DocumentService,
  ) {
  }

  @Input() booking!: BookingDto
  @Input() uid!: string

  activeStep = 0;
  activeDocumentStep = 0;

  _promoter = false
  _manager = false
  _artist = false

  ngOnInit(): void {
    this._promoter = this.booking.promoterUid === this.uid
    this._manager = this.booking.managerUid === this.uid
    this._artist = this.booking && BookingUtil.artistSignatures(this.booking).includes(this.uid)

    if (this.booking.status !== 'SUBMITTED') {
      this.activeStep = 1
    }
  }

  _showFormData(booking: BookingDto) {
    this.bookingService.fetchFormData$(booking.formId).pipe(
      tap(formData => {
        if (formData) {
          this.store.dispatch(setBookingFormData(formData))
        }
      })
    ).subscribe()
  }

  _getPdf(booking: BookingDto, template: Template) {
    this.documentService.getPdf(booking.formId, template)
  }

  _signContract(booking: BookingDto) {
    this.documentService.signContract(booking.formId)
  }

}
