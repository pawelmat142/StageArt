import { Component } from '@angular/core';
import { MediaItemComponent } from '../../../../global/components/media-item/media-item.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { artistMedias, editMode, updateMedias } from '../artist-view.state';
import { CommonModule } from '@angular/common';
import { ArtistMedia, ArtistMediaCode, ArtistMediasService } from '../../../artist-medias/artist-medias.service';
import { Util } from '../../../../global/utils/util';
import { Dialog, DialogData } from '../../../../global/nav/dialog.service';
import { Validators } from '@angular/forms';
import { noop, of, switchMap, take, tap } from 'rxjs';
import { SelectorItem } from '../../../../global/interface';
import { DropdownComponent } from '../../../../global/controls/dropdown/dropdown.component';

@Component({
  selector: 'app-medias',
  standalone: true,
  imports: [
    CommonModule,
    MediaItemComponent,
    DropdownComponent
  ],
  templateUrl: './medias.component.html',
  styleUrl: './medias.component.scss'
})
export class MediasComponent {

  constructor(
    private readonly store: Store<AppState>,
    private readonly artistMediasService: ArtistMediasService,
    private readonly dialog: Dialog,
  ) {}

  ngOnInit(): void {
    this._items = this.artistMediasService.getMedias().filter(type => !!type).map(mediaType => {
      return {
        code: mediaType,
        name: Util.fromSnakeCase(mediaType),
        svg: mediaType
      }
    })
  }

  _items: SelectorItem[] = []

  _editMode$ = this.store.select(editMode).pipe(
    tap(editMode => {
      if (!editMode) {
        this._editMedias = false
      } 
    })
  )

  _medias$ = this.store.select(artistMedias)


  editMedias() {
    this._editMedias = true
  }

  _editMedias = false

  _selectMedia(item: SelectorItem) {
    this._editMedias = false
    const data: DialogData = {
      header: `${item.name}`,
      input: 'url',
      inputValidators: [Validators.required],
    }

    this.dialog.popup(data).onClose.pipe(
      switchMap(url => {
        if (url) {
          const media: ArtistMedia = {
            code: item.code as ArtistMediaCode,
            url: url
          }
          return this._medias$.pipe(
            take(1),
            tap(medias => {
              const newMedias = medias ? [...medias, media] : [media]
              this.store.dispatch(updateMedias({ value: newMedias }))
            })
          )
        }
        return of(noop())
      })
    ).subscribe()

  }

}
