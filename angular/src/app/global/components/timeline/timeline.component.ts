import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TimelineItem } from '../../../booking/services/artist-timeline.service';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DateUtil } from '../../utils/date-util';
import { TimelineItemsComponent } from './timeline-items/timeline-items.component';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    ButtonModule,
    TimelineModule,
    CardModule,
    CommonModule,
    TimelineItemsComponent,
    AccordionModule
  ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnChanges, OnInit {

  readonly TODAY_FORM_ID_MOC = 'TODAY'
  
  @Input() timeline!: TimelineItem[]

  past: TimelineItem[] = []

  @Input() showDaysBefore = 2

  minDate = new Date()

  _showPast = false

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate() - this.showDaysBefore)
    this.prepareTimeline()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeline'].firstChange) {
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
    return new Date(item.formData.eventInformation.performanceStartDate)
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
      formData: { eventInformation: { performanceStartDate: new Date } },
      status: 'PENDING',
      formId: this.TODAY_FORM_ID_MOC,
    })
  }

}
