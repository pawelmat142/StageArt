import { Component, Input } from '@angular/core';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { MatChipsModule} from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { CountryComponent } from '../country/country.component';
import { MediaItemComponent } from '../media-item/media-item.component';
import { NavService } from '../../../services/nav.service';


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
  styleUrl: './artist-card.component.scss'
})
export class ArtistCardComponent {

  constructor(
    private readonly nav: NavService
  ) {}

  @Input() artist!: ArtistViewDto

  goToArtist() {
    this.nav.toArtist(this.artist.name)
  }

}
