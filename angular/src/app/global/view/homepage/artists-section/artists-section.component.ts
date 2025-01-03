import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { selectArtists, initArtists } from '../../../../artist/artists.state';
import { ArtistViewDto } from '../../../../artist/model/artist-view.dto';
import { ArtistCardComponent } from '../../../../artist/view/artist-card/artist-card.component';
import { NavService } from '../../../nav/nav.service';
import { Path } from '../../../nav/path';
import { ButtonModule } from 'primeng/button';
import { $desktop } from '../../../tools/media-query';

@Component({
  selector: 'app-artists-section',
  standalone: true,
  imports: [
    CommonModule,
    ArtistCardComponent,
    CarouselModule,
    ButtonModule,
  ],
  templateUrl: './artists-section.component.html',
  styleUrl: './artists-section.component.scss',
})
export class ArtistsSectionComponent {

  $desktop = $desktop;

  artists$: Observable<ArtistViewDto[]>

  constructor(
    private readonly nav: NavService,
    private store: Store<AppState>,
  ) {
    this.artists$ = this.store.select(selectArtists).pipe(
      map(artists => {
        if (artists.length === 1) {
          return [ artists[0], artists[0], artists[0]]
        }
        if (artists.length === 2) {
          return [ ...artists, ...artists ]
        }
        return artists
      })
    )
  }
  
  ngOnInit(): void {
    this.store.dispatch(initArtists())
  }

  _viewAll() {
    this.nav.toArtists()
  }

}

