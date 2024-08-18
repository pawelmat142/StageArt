import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ArtistService } from '../../artist.service';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { ArtistViewDto } from '../../model/artist-view.dto';
import { StatusPipe } from "../../../global/pipes/status.pipe";
import { BtnComponent } from '../../../global/controls/btn/btn.component';

@Component({
  selector: 'app-panel-artists',
  standalone: true,
  imports: [
    CommonModule,
    StatusPipe,
    BtnComponent,
],
  templateUrl: './panel-artists.component.html',
  styleUrl: './panel-artists.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PanelArtistsComponent {

  constructor(
    private readonly artistService: ArtistService,
    private readonly store: Store<AppState>,
  ) {}


  _artists$: Observable<ArtistViewDto[]> = this.artistService.fetchArtistsOfManager$().pipe(
    tap(console.log)
  )

  _addNotes(artist: ArtistViewDto) {
    console.log(artist)

  }


}
