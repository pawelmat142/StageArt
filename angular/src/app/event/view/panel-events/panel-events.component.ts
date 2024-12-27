import { Component } from '@angular/core';
import { EventDto, EventService } from '../../services/event.service';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { StatusPipe } from "../../../global/pipes/status.pipe";
import { AccordionModule } from 'primeng/accordion';
import { tap } from 'rxjs';

@Component({
  selector: 'app-panel-events',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe,
    AccordionModule,
],
  templateUrl: './panel-events.component.html',
  styleUrl: './panel-events.component.scss',
})
export class PanelEventsComponent {

  constructor(
    private readonly eventService: EventService,
    private readonly store: Store<AppState>,
  ) {}

  _events$ = this.eventService.fetchPromoterEvents$()
  // TODO remove
  .pipe(tap(console.log))

  _selectEvent(index: number | number[]) {
    console.log(`TODO: select event index: ${index}`)
  }

  _openEvent(event: EventDto) {
    console.log('TODO _openEvent')
    console.log(event)
  }

}
