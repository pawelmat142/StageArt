import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { selectArtists, initArtists } from '../../../../artist/artists.state';
import { ArtistViewDto } from '../../../../artist/model/artist-view.dto';
import { ArtistCardComponent } from '../../../../artist/view/artist-card/artist-card.component';
import { BtnComponent } from '../../../controls/btn/btn.component';
import { NavService } from '../../../nav/nav.service';
import { DESKTOP } from '../../../services/device';
import { Path } from '../../../nav/path';


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

  _viewAll() {
    this.nav.to(Path.ARTISTS_LIST_VIEW)
  }

}

