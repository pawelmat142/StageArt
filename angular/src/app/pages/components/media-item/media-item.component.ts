import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ArtistMedia } from '../../../services/artist/artist-medias/artist-medias.service';
import { Util } from '../../../utils/util';

@Component({
  selector: 'app-media-item',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
  ],
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.scss'
})
export class MediaItemComponent {

  @Input() media!: ArtistMedia
  @Input() hideName = false
  @Input() color = 'light'
  @Input() size = 30

  _name = ''

  ngOnInit(): void {
    this._name = Util.capitalizeFirstLetter(this.media?.code)
  }

}
