import { Component, OnInit } from '@angular/core';
import { EventDto, EventService } from '../../services/event.service';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { StatusPipe } from "../../../global/pipes/status.pipe";
import { AccordionModule } from 'primeng/accordion';
import { setBookingsBreadcrumb } from '../../../profile/profile.state';
import { BreadcrumbUtil } from '../../../booking/breadcrumb.util';

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
export class PanelEventsComponent implements OnInit {

  constructor(
    private readonly eventService: EventService,
    private readonly store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.setBreadcrumb()
  }

  _events$ = this.eventService.fetchPromoterEvents$()

  _selectEvent(index: number | number[]) {
    console.log(`TODO: select event index: ${index}`)
  }

  _openEvent(event: EventDto) {
    console.log('TODO _openEvent')
    console.log(event)
  }

  private setBreadcrumb = () => {
    this.store.dispatch(setBookingsBreadcrumb({ value: BreadcrumbUtil.events() }))
  }

}
