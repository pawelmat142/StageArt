import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ArtistMedia } from '../../../artist/artist-medias/artist-medias.service';
import { Util } from '../../../global/utils/util';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { artistMedias, editMode, updateMedias } from '../../../artist/view/artist-view/artist-view.state';
import { map, noop, of, switchMap, take, tap } from 'rxjs';
import { DialogData } from '../../nav/dialogs/popup/popup.component';
import { DialogService } from '../../nav/dialog.service';

@Component({
  selector: 'app-media-item',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
  ],
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MediaItemComponent {

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: DialogService,
  ) {}

  @Input() media!: ArtistMedia
  @Input() hideName = false
  @Input() color = 'light'
  @Input() size = 30

  _name = ''

  ngOnInit(): void {
    this._name = Util.capitalizeFirstLetter(this.media?.code)
  }

  _editMode$ = this.store.select(editMode)

  _medias$ = this.store.select(artistMedias)

  _remove() {
    this.store.select(artistMedias).pipe(
      take(1),
      map(medias => {
        if (medias) {
          const newMedias = medias.filter(m => m.url !== this.media.url)
          this.store.dispatch(updateMedias({ value: newMedias }))
        }
      })
    ).subscribe()
  } 

  _edit() {
    const data: DialogData = {
      header: Util.capitalizeFirstLetter(this.media.code),
      input: 'url',
      inputValue: this.media.url
    }

    this.dialog.popup(data).afterClosed().pipe(
      switchMap(url => {
        if (url) {
          return this._medias$.pipe(
            take(1),
            tap(medias => {
              if (medias) {
                const newMedias = medias.map(m => {
                  if (m.url === this.media.url) {
                    return {
                      ...m,
                      url: url
                    }
                  }
                  return m
                })
                this.store.dispatch(updateMedias({ value: newMedias }))
              }
            })
          )
        }
        return of(noop())
      })
    ).subscribe()
  }

}
