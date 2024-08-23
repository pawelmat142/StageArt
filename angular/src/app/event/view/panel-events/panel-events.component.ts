import { Component, ViewEncapsulation } from '@angular/core';
import { EventPanelDto, EventService } from '../../services/event.service';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { StatusPipe } from "../../../global/pipes/status.pipe";

@Component({
  selector: 'app-panel-events',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe
],
  templateUrl: './panel-events.component.html',
  styleUrl: './panel-events.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PanelEventsComponent {

  constructor(
    private readonly eventService: EventService,
    private readonly store: Store<AppState>,
  ) {}

  _events$ = this.eventService.fetchPromotorEvents$()


  _openEvent(event: EventPanelDto) {
    console.log('TODO _openEvent')
    console.log(event)
  }

}
