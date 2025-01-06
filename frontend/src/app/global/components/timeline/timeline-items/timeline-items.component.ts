import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { TimelineItem } from '../../../../booking/services/artist-timeline.service';
import { CardModule } from 'primeng/card';
import { CountryComponent } from '../../country/country.component';
import { ButtonModule } from 'primeng/button';
import { IconButtonComponent } from '../../icon-button/icon-button.component';
import { Token } from '../../../../profile/auth/view/token';

@Component({
  selector: 'app-timeline-items',
  standalone: true,
  imports: [
    CommonModule,
    TimelineModule,
    CardModule,
    CountryComponent,
    ButtonModule,
    IconButtonComponent
  ],
  templateUrl: './timeline-items.component.html',
  styleUrl: './timeline-items.component.scss'
})
export class TimelineItemsComponent {

  @Input() timeline!: TimelineItem[]

  @Input() editMode!: boolean

  @Output() close = new EventEmitter<TimelineItem>()

  uid = Token.getUid()

}
