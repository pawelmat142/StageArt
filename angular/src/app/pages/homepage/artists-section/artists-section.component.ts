import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ArtistService } from '../../../services/artist/artist.service';
import { map, Observable, of } from 'rxjs';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { ArtistCardComponent } from '../../components/artist-card/artist-card.component';
import { CarouselModule } from 'primeng/carousel';
import { BtnComponent } from '../../controls/btn/btn.component';
import { NavService } from '../../../services/nav.service';
import { ArtistsViewComponent } from '../../views/artists-view/artists-view.component';
import { DESKTOP } from '../../../services/device';

@Component({
  selector: 'app-artists-section',
  standalone: true,
  imports: [
    CommonModule,
    ArtistCardComponent,
    CarouselModule,
    BtnComponent,
  ],
  templateUrl: './artists-section.component.html',
  styleUrl: './artists-section.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ArtistsSectionComponent {

  DESKTOP = DESKTOP

  constructor(
    private readonly artistService: ArtistService,
    private readonly nav: NavService,
  ) {}

  _artists$: Observable<ArtistViewDto[]> = of([])

  ngOnInit(): void {
    this.fetchArstis$()
  }

  private fetchArstis$() {
    this._artists$ = this.artistService.fetchArtists$()
      // TODO mock
      .pipe(map(artists => [...artists, ...artists, ...artists, ...artists,...artists, ...artists]))
  }

  navToArtists() {
    return this.nav.to(ArtistsViewComponent.path)
  }

}
