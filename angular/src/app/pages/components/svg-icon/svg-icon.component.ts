import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ArtistMediaCode } from '../../../services/artist-medias/artist-medias.service';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss'
})
export class SvgIconComponent {

  @Input() icon!: ArtistMediaCode
  @Input() size = 50

}
