import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TimelineItem } from '../../../booking/services/artist-timeline.service';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    ButtonModule,
    TimelineModule,
    CardModule,
    CommonModule,
  ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {

  @Input() timeline!: TimelineItem[]

}
