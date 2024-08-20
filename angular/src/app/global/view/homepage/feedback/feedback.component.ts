import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../../controls/btn/btn.component';
import { TextareaElementComponent } from '../../../controls/textarea-element/textarea-element.component';
import { FeedbackService } from './feedback-service';
import { take } from 'rxjs';
import { DialogService } from '../../../nav/dialog.service';
import { CourtineService } from '../../../nav/courtine.service';
import { DESKTOP } from '../../../services/device';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    BtnComponent,
    TextareaElementComponent,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FeedbackComponent {

  readonly DESKTOP = DESKTOP

  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly dialog: DialogService,
    private readonly courtine: CourtineService,
  ) {}

  value = ''

  _onInput(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.value = input.value
  }

  _send() {
    if (!this.value) {
      return
    }
    this.courtine.startCourtine()
    this.feedbackService.send$(this.value).pipe(
      take(1),
    ).subscribe({
      next: () => {
        this.value = ''
        this.courtine.stopCourtine()
        this.dialog.simplePopup(`Thanks! It's so helpful.`)
      },
      error: error => {
        this.courtine.stopCourtine()
        this.dialog.errorPopup(error.error.message)
      }
    })
  }


}
