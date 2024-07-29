import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ArtistService } from '../../../services/artist/artist.service';
import { map, Observable, of } from 'rxjs';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { ArtistCardComponent } from '../../components/artist-card/artist-card.component';

@Component({
  selector: 'app-artists-section',
  standalone: true,
  imports: [
    CommonModule,
    ArtistCardComponent,
  ],
  templateUrl: './artists-section.component.html',
  styleUrl: './artists-section.component.scss'
})
export class ArtistsSectionComponent {

  constructor(
    private readonly artistService: ArtistService
  ) {}

  _artists$: Observable<ArtistViewDto[]> = of([])

  ngOnInit(): void {
    this.fetchArstis$()
  }

  private fetchArstis$() {
    this._artists$ = this.artistService.fetchArtists$()
      // TODO mock
      .pipe(map(artists => [...artists, ...artists, ...artists, ...artists]))
  }

}
