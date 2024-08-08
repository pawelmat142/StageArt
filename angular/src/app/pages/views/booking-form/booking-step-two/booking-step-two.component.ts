import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from "../../../controls/input/input.component";
import { SelectorComponent, SelectorItem } from '../../../controls/selector/selector.component';
import { map, Observable, of, tap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ArtistsState, initArtists } from '../../../../store/artist/artists.state';
import { ArtistViewDto } from '../../../../services/artist/model/artist-view.dto';

@Component({
  selector: 'app-booking-step-two',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SelectorComponent
],
  templateUrl: './booking-step-two.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BookingStepTwoComponent {

  @Input() form?: FormGroup

  artistItems$: Observable<SelectorItem[]> = of([])

  constructor(
    private store: Store<{ artists: ArtistsState }>,
  ) {
    this.artistItems$ = this.store
      .pipe(select(store => store.artists.artists))
      .pipe(map(artists => artists.map(a => this.artistToSelectorItem(a))))
    }

  ngOnInit(): void {
    this.store.dispatch(initArtists())
  }

  private artistToSelectorItem = (artist: ArtistViewDto): SelectorItem => {
    return {
      code: artist.name,
      name: artist.name,
      imgUrl: artist.images.avatar?.mini?.url
    }
  }

}
