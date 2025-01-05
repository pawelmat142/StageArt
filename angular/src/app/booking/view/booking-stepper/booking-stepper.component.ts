import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { BookingDto, BookingService } from '../../services/booking.service';
import { of, switchMap, tap } from 'rxjs';
import { loadBookings } from '../../../profile/profile.state';
import { SubstepComponent } from './substep/substep.component';
import { CommonModule } from '@angular/common';
import { PaperTileComponent } from '../../../global/components/paper-tile/paper-tile.component';
import { Dialog } from '../../../global/nav/dialog.service';
import { ChecklistTile } from '../../interface/checklist.interface';
import { ChecklistUtil } from '../../checklist.util';
import { Token } from '../../../profile/auth/view/token';

@Component({
  selector: 'app-booking-stepper',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule, 
    StepperModule,
    SubstepComponent,
    PaperTileComponent,
    ButtonModule
  ],
  templateUrl: './booking-stepper.component.html',
  styleUrl: './booking-stepper.component.scss',
})
export class BookingStepperComponent implements OnChanges{

  constructor(
    private readonly store: Store<AppState>,
    private readonly bookingService: BookingService,
    private readonly dialog: Dialog,
  ) {}

  activeStep = 0;

  _uid = Token.getUid()
  _checklistTiles: ChecklistTile[] = []

  @Input() booking!: BookingDto

  ngOnChanges(changes: SimpleChanges): void {
    this.setProcessStepIndex(this.booking)
    this._checklistTiles = this.booking?.checklist.length && this._uid 
      ? ChecklistUtil.prepareTiles(this.booking, this._uid)
      : []
  }

  private setProcessStepIndex(booking?: BookingDto) {
    if (booking?.status === 'SUBMITTED') {
      this.activeStep = 0
    }
    if (booking?.status === 'DOCUMENTS') {
      this.activeStep = 1
    }
    if (booking?.status === 'CHECKLIST_COMPLETE') {
      this.activeStep = 2
    }
  }

  
  // STEP 1#
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

  _acceptBooking(booking: BookingDto) {
    this.dialog.yesOrNoPopup(`Booking request will be accepted, documents step will be started. Sure?`, true).pipe(
      switchMap(confirm => confirm 
        ? this.bookingService.requestDocuments$(booking.formId).pipe(
          tap(booking => {
            this.store.dispatch(loadBookings())
          }))
        : of()
      ),
    ).subscribe()
  }
  
}
