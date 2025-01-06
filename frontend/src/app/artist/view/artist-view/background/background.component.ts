import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { artist, artistTempBgImage, editMode } from '../artist-view.state';
import { filter, map, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ImgUtil } from '../../../../global/utils/img.util';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule 
  ],
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss',
})
export class BackgroundComponent {

  constructor(
    private readonly store: Store<AppState>
  ) {}

  _currentBgUrl$ = this.store.select(artist).pipe(
    map(artist => artist?.images?.bg?.at(0)),
    filter(x => !!x),
    map(img => img.bg?.url),
  )

  _displayImg$ = this.store.select(editMode).pipe(
    switchMap(editMode => {
      if (editMode) {
        return this.store.select(artistTempBgImage).pipe(
          switchMap(file => {
            if (file) {
              return ImgUtil.blobToBase64$(ImgUtil.fileToBlob(file))
            } else {
              return this._currentBgUrl$
            }
          })
        )
      } else {
        return this._currentBgUrl$
      }
    })
  )

}
