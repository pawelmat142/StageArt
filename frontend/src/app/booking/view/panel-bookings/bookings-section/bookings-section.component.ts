import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { BookingDto } from '../../../services/booking.service';
import { StatusPipe } from "../../../../global/pipes/status.pipe";
import { AccordionModule } from 'primeng/accordion';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { selectBooking, setBookingsBreadcrumb, uid } from '../../../../profile/profile.state';
import { NamesPipe } from "../../../../global/pipes/names.pipe";
import { $desktop } from '../../../../global/tools/media-query';
import { BreadcrumbUtil } from '../../../breadcrumb.util';
import { SortLabel, SortListComponent } from '../../../../global/components/sort-list/sort-list.component';

@Component({
  selector: 'app-bookings-section',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    SortListComponent
],
  templateUrl: './bookings-section.component.html',
  styleUrl: './bookings-section.component.scss',
})
export class BookingsSectionComponent implements OnInit {

  readonly $desktop = $desktop;

  constructor(
    private readonly store: Store<AppState>,
  ) {}

  _profileUid$ = this.store.select(uid)

  @Input() header: string = 'header'

  @Input() bookings!: BookingDto[]


  labels: SortLabel[] = [{
    name: 'Event name',
    itemPath: 'event.name',
    type: 'string',
    changeOnClick: true
  }, {
    name: 'Event date',
    itemPath: 'event.startDate',
    type: 'date',
    sort: true,
    itemPipeArgs: [],
    changeOnClick: true,
  }, {
    name: 'Status',
    type: 'string',
    order: ['SUBMITTED', 'DOCUMENTS', 'CHECKLIST_COMPLETE', 'PENDING', 'READY', 'CANCELED'],
    changeOnClick: true,
    itemPath: 'status',
    itemPipe: new StatusPipe(),
  }, {
    name: 'Artist',
    type: 'string',
    itemPath: 'artists',
    itemPipe: new NamesPipe(),
    showDesktop: true,
  }]

  ngOnInit(): void {
    this.setBookingsBreadcrumb()
  }
  
  private setBookingsBreadcrumb() {
    this.store.dispatch(setBookingsBreadcrumb({ value: BreadcrumbUtil.bookings() }))
  }

  _selectBooking(index: number) {
    const selectedBooking = this.bookings[index]
    this.store.dispatch(selectBooking(selectedBooking))
  }

}
