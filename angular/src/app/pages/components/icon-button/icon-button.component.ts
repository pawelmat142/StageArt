import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { ArtistMediaCode } from '../../../services/artist/artist-medias/artist-medias.service';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent {
  
  @Input() icon?: string
  @Input() src?: string
  @Input() mediaIcon?: ArtistMediaCode
  
  @Input() button: boolean = true
  @Input() active = true
  @Input() show = true

  @Input() size: number = 40
  @Input() color = 'red'
  @Input() border = false

  @Output() click = new EventEmitter<void>()

  _click(event: MouseEvent) {
    this.click.emit()
    event.preventDefault()
    event.stopPropagation()
  }
}
