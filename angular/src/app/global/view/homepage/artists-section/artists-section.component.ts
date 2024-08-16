import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { selectArtists, initArtists } from '../../../../artist/artists.state';
import { ArtistViewDto } from '../../../../artist/model/artist-view.dto';
import { ArtistCardComponent } from '../../../../artist/view/artist-card/artist-card.component';
import { ArtistsViewComponent } from '../../../../artist/view/artists-view/artists-view.component';
import { BtnComponent } from '../../../controls/btn/btn.component';
import { NavService } from '../../../nav/nav.service';
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

  artists$: Observable<ArtistViewDto[]>

  constructor(
    private readonly nav: NavService,
    private store: Store<AppState>,
  ) {
    this.artists$ = this.store.select(selectArtists).pipe(
    )
  }
  
  ngOnInit(): void {
    this.store.dispatch(initArtists())
  }

  navToArtists() {
    return this.nav.to(ArtistsViewComponent.path)
  }

}

