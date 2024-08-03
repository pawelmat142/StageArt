import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ArtistCardComponent } from '../../components/artist-card/artist-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ArtistService } from '../../../services/artist/artist.service';
import { NavService } from '../../../services/nav.service';
import { map, Observable, of, tap } from 'rxjs';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { BtnComponent } from '../../controls/btn/btn.component';
import { select, Store } from '@ngrx/store';
import { ArtistsState, fetchArtists } from '../../../store/artist/artists.state';

@Component({
  selector: 'app-artists-view',
  standalone: true,
  imports: [
    CommonModule,
    ArtistCardComponent,
    HeaderComponent,
    BtnComponent,
  ],
  templateUrl: './artists-view.component.html',
  styleUrl: './artists-view.component.scss'
})
export class ArtistsViewComponent {

  public static readonly path = `artists`

  artists$: Observable<ArtistViewDto[]>

  constructor(
    private readonly nav: NavService,
    private store: Store<{ artists: ArtistsState }>
  ) {
    this.artists$ = this.store
      .pipe(select(store => store.artists.artists))
  }


  ngOnInit(): void {
    this.store.dispatch(fetchArtists())
  }

}
