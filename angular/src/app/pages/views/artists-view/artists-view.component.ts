import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ArtistCardComponent } from '../../components/artist-card/artist-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { NavService } from '../../../services/nav.service';
import { map, Observable } from 'rxjs';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { BtnComponent } from '../../controls/btn/btn.component';
import { select, Store } from '@ngrx/store';
import { ArtistsState, initArtists } from '../../../store/artist/artists.state';
import { BookingFormComponent } from '../booking-form/booking-form.component';

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
    private store: Store<{ artists: ArtistsState }>
  ) {
    this.artists$ = this.store
      .pipe(select(store => store.artists.artists))
  }


  ngOnInit(): void {
    this.store.dispatch(initArtists())
  }

  _bookNow() {
    this.nav.to(BookingFormComponent.path)
  }

}
