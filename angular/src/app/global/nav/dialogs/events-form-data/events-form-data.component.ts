import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { EventDto } from '../../../../event/services/event.service';
import { BtnComponent } from '../../../controls/btn/btn.component';
import { StatusPipe } from "../../../pipes/status.pipe";
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig<EventDto[]>
  ) {}

  get data() {
    return this.config.data
  }

  _close() {
    this.ref.close()
  }

  _select(event: EventDto) {
    this.ref.close(event)
  }

}
