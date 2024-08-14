import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { ArtistViewDto } from '../../../artist/model/artist-view.dto';
import { Store } from '@ngrx/store';
import { initArtists, selectArtists } from '../../artists.state';
import { BookFormComponent } from '../../../booking/view/book-form/book-form.component';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { ArtistCardComponent } from '../artist-card/artist-card.component';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { NavService } from '../../../global/nav/nav.service';
import { AppState } from '../../../app.state';

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
