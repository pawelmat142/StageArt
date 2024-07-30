import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ArtistCardComponent } from '../../components/artist-card/artist-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ArtistService } from '../../../services/artist/artist.service';
import { NavService } from '../../../services/nav.service';
import { map, Observable, of } from 'rxjs';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { BtnComponent } from '../../controls/btn/btn.component';

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

}
