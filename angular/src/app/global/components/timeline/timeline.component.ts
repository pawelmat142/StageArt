import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TimelineItem } from '../../../booking/services/artist-timeline.service';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DateUtil } from '../../utils/date-util';
import { TimelineItemsComponent } from './timeline-items/timeline-items.component';
import { AccordionModule } from 'primeng/accordion';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../controls/form-field/form-field.component';
import { CalendarModule } from 'primeng/calendar';
import { FormUtil } from '../../utils/form.util';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    ButtonModule,
    TimelineModule,
    CardModule,
    CommonModule,
    TimelineItemsComponent,
    AccordionModule,
    ReactiveFormsModule,
    FormFieldComponent,
    CalendarModule,
    InputTextModule
  ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnChanges, OnInit {

  readonly TODAY_FORM_ID_MOC = 'TODAY'
  
  @Input() timeline!: TimelineItem[]

  @Output() submitTimelineForm = new EventEmitter<TimelineItem>()
  @Output() removeTimelineForm = new EventEmitter<TimelineItem>()

  past: TimelineItem[] = []

  @Input() showDaysBefore = 2

  @Input() editMode = false
  @Input() disabledDates: Date[] = []

  minDate = new Date()

  _showPast = false

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() - this.showDaysBefore)
    this.prepareTimeline()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeline']?.firstChange) {
      return
    }
    this.prepareTimeline()
  }

  _showPrev = false

  _showPrevious() {
    this._showPrev = !this._showPrev
  }
  
  private prepareTimeline() {
    this.filterBeforeMinDate()
    this.addToday()
    this.sort()
  }
  
  private sort() {
    this.timeline.sort((b, a) => this.date(b).getTime() - this.date(a).getTime())
  }

  private filterBeforeMinDate() {
    const timeline: TimelineItem[] = []
    const past: TimelineItem[] = []
    for (let i = 0; i < this.timeline.length; i++) {
      const item = this.timeline[i]
      if (this.date(item).getTime() > this.minDate.getTime()) {
        timeline.push(item)
      } else {
        past.push(item)
      }
    }
    this.timeline = timeline
    this.past = past
  }

  private date(item: TimelineItem): Date {
    return new Date(item.startDate)
  }

  private addToday() {
    const today = new Date()
    for (let item of this.timeline) {
      if (DateUtil.sameDay(this.date(item), today)) {
        return 
      }
    }
    this.timeline.push({
      eventSignature: '',
      header: 'TODAY',
      startDate: new Date(),
      status: 'PENDING',
      id: this.TODAY_FORM_ID_MOC,
    })
  }

  _showPastEvents = 'Show past events'

  _shoPastEventsToggle(event: any) {
    this.closeEventForm()
    if (Number.isInteger(event)) {
      this._showPastEvents = `Hide past events`
    } else {
      this.closePastEvents()
    }
  }

  _toggleEventForm(event: any) {
    this.closePastEvents()
    if (Number.isInteger(event)) {

    } else {
      this.closeEventForm()
    }
  }
  
  _eventFormActiveIndex = -1
  _pastEventsActiveIndex = -1

  private closeEventForm() {
    this._eventFormActiveIndex = -1
  }

  private closePastEvents() {
    this._pastEventsActiveIndex = -1
    this._showPastEvents = 'Show past events'
  }

  form = new FormGroup({
    header: new FormControl('', Validators.required),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null),
    subheader: new FormControl(''),
    content: new FormControl('', ),
  })

  _submit() {
    if (this.form?.invalid) {
      FormUtil.markForm(this.form)
      return
    }
    this.closeEventForm()
    const event = this.form.value as TimelineItem
    this.submitTimelineForm.emit(event)
  }

  _removeItem(item: TimelineItem) {
    this.removeTimelineForm.emit(item)
  }
}
