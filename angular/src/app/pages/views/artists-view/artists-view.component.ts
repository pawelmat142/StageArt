import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ArtistCardComponent } from '../../components/artist-card/artist-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NavService } from '../../../services/nav/nav.service';
import { Observable } from 'rxjs';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { BtnComponent } from '../../controls/btn/btn.component';
import { Store } from '@ngrx/store';
import { initArtists, selectArtists } from '../../../store/artist/artists.state';
import { BookFormComponent } from '../book-form/book-form.component';
import { AppState } from '../../../store/app.state';

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
export class ArtistsViewComponent {

  public static readonly path = `artists`

  artists$: Observable<ArtistViewDto[]>

  constructor(
    private readonly nav: NavService,
    private store: Store<AppState>
  ) {
    this.artists$ = this.store.select(selectArtists)
  }


  ngOnInit(): void {
    this.store.dispatch(initArtists())
  }

  _bookNow() {
    this.nav.to(BookFormComponent.path)
  }

}
