import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventDto } from '../../../../event/services/event.service';
import { BtnComponent } from '../../../controls/btn/btn.component';
import { StatusPipe } from "../../../pipes/status.pipe";

@Component({
  selector: 'app-events-form-data',
  standalone: true,
  imports: [
    CommonModule,
    BtnComponent,
    StatusPipe
],
  templateUrl: './events-form-data.component.html',
  styleUrl: './events-form-data.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EventsFormDataComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<EventsFormDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDto[],
  ) {}

  _close() {
    this.dialogRef.close()
  }

  _select(event: EventDto) {
    this.dialogRef.close(event)
  }

}
