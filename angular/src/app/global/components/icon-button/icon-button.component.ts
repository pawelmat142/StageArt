import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { ArtistMediaCode } from '../../../artist/artist-medias/artist-medias.service';
import { ImgCachedComponent } from '../img-cached/img-cached.component';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ImgCachedComponent,
  ],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class IconButtonComponent {
  
  @Input() icon?: string
  @Input() mediaIcon?: ArtistMediaCode
  @Input() src?: string
  @Input() chachedImg = false

  @Input() button: boolean = true
  @Input() active = true
  @Input() show = true

  @Input() skipEvent = true

  @Output() click = new EventEmitter<Event | void>()

  _click(event: MouseEvent) {
    this.click.emit(event)
    if (this.skipEvent) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
