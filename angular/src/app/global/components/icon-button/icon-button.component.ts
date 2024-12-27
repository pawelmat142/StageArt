import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArtistMediaCode } from '../../../artist/artist-medias/artist-medias.service';
import { ImgCachedComponent } from '../img-cached/img-cached.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [
    CommonModule,
    ImgCachedComponent,
    IconComponent
  ],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
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
