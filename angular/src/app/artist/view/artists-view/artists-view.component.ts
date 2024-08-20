import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { ArtistCardComponent } from '../artist-card/artist-card.component';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { Path } from '../../../global/nav/path';
import { initArtists, selectArtists } from '../../artists.state';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { NavService } from '../../../global/nav/nav.service';

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
  styleUrl: './artists-view.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ArtistsListViewComponent {

  public static readonly path = Path.ARTISTS_LIST_VIEW

  constructor(
    private readonly nav: NavService,
    private store: Store<AppState>
  ) {}

  artists$ = this.store.select(selectArtists).pipe(
  )

  ngOnInit(): void {
    this.store.dispatch(initArtists())
  }

  _bookNow() {
    this.nav.to(Path.BOOK_FORM_VIEW)
  }

}
