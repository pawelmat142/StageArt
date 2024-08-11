import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { ArtistCardComponent } from '../../components/artist-card/artist-card.component';
import { CarouselModule } from 'primeng/carousel';
import { BtnComponent } from '../../controls/btn/btn.component';
import { NavService } from '../../../services/nav/nav.service';
import { ArtistsViewComponent } from '../../views/artists-view/artists-view.component';
import { DESKTOP } from '../../../services/device';
import { select, Store } from '@ngrx/store';
import { ArtistsState, initArtists } from '../../../store/artist/artists.state';

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

  artists$: Observable<ArtistViewDto[]>

  constructor(
    private readonly nav: NavService,
    private store: Store<{ artists: ArtistsState }>,
  ) {
    this.artists$ = this.store
      .pipe(select(store => store.artists.artists))
  }
  
  ngOnInit(): void {
    this.store.dispatch(initArtists())
  }

  navToArtists() {
    return this.nav.to(ArtistsViewComponent.path)
  }

}

