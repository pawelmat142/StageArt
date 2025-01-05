import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { TimelineItem } from '../../../../booking/services/artist-timeline.service';
import { CardModule } from 'primeng/card';
import { CountryComponent } from '../../country/country.component';

@Component({
  selector: 'app-timeline-items',
  standalone: true,
  imports: [
    CommonModule,
    TimelineModule,
    CardModule,
    CountryComponent
  ],
  templateUrl: './timeline-items.component.html',
  styleUrl: './timeline-items.component.scss'
})
export class TimelineItemsComponent {

  @Input() timeline!: TimelineItem[]

  @Input() editMode!: boolean

}
