import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ArtistViewDto } from '../../../artist/model/artist-view.dto';
import { MatChipsModule} from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { CountryComponent } from '../../../global/components/country/country.component';
import { MediaItemComponent } from '../../../global/components/media-item/media-item.component';
import { NavService } from '../../../global/nav/nav.service';
import { ArtistUtil } from '../../artist.util';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [
    MatChipsModule,
    CommonModule,
    CountryComponent,
    MediaItemComponent,
  ],
  templateUrl: './artist-card.component.html',
  styleUrl: './artist-card.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArtistCardComponent {

  constructor(
    private readonly nav: NavService
  ) {}

  @Input() artist!: ArtistViewDto

  _avatarUrl = ''

  ngOnInit(): void {
    this._avatarUrl = ArtistUtil.avatarUrl(this.artist.images) || ''
  }

  goToArtist() {
    this.nav.toArtist(this.artist.name)
  }

}
