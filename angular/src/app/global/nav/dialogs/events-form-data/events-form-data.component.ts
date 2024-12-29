import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EventDto } from '../../../../event/services/event.service';
import { StatusPipe } from "../../../pipes/status.pipe";
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-events-form-data',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe,
    ButtonModule
],
  templateUrl: './events-form-data.component.html',
  styleUrl: './events-form-data.component.scss',
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
