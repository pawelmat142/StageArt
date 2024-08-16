import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { DialogService } from '../../../../global/nav/dialog.service';
import { SelectorItemsComponent } from '../../../../global/controls/selector/selector-items/selector-items.component';
import { CommonModule } from '@angular/common';
import { editMode, updateStyle } from '../artist-view.state';
import { map, Observable, of, take, tap } from 'rxjs';
import { DialogData } from '../../../../global/nav/dialogs/popup/popup.component';
import { MusicStyle } from '../../../model/artist-view.dto';
import { ArtistService } from '../../../artist.service';
import { SelectorItem } from '../../../../global/controls/selector/selector.component';

@Component({
  selector: 'app-style',
  standalone: true,
  imports: [
    CommonModule,
    SelectorItemsComponent
  ],
  templateUrl: './style.component.html',
  styleUrl: './style.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class StyleComponent {
  
  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: DialogService,
    private readonly artistService: ArtistService,
  ) {}

  ngOnInit(): void {
    this.loadStyleItems()
  }

  private loadStyleItems() {
    this._styleItems$ = this.artistService.listMusicStyles().pipe(
      take(1),
      map(styles => styles.styles.map(name => ({
        code: name,
        name: name
      }))),
      tap(console.log)
    )
  }

  _styleItems$: Observable<SelectorItem[]> = of([])

  _editMode$ = this.store.select(editMode).pipe(
    tap(mdoe => {
      if (!mdoe) {
        this._editStyle = false
      }
    })
  )

  _length = 0

  _styles$ = this.store.select(state => state.artistViewState.artist?.style)
    .pipe(tap(styles => this._length = styles?.length || 0))


  _editStyle = false

  _edit() {
    const data: DialogData = {
      header: 'Add new or select...',
      select: 'Music style',
      items: this._styleItems$  
    }
    this.dialog.popup(data).afterClosed().pipe(
      tap(name => {
        if (name) {
          this.addStyle(name)
        }
      }),
    ).subscribe()
  }

  _remove() {
    this._styles$.pipe(
      take(1),
      tap(styles => {
        if (styles) {
          const newStyles = [...styles]
          newStyles.pop()
          this.store.dispatch(updateStyle({ value: newStyles }))
        }
      })
    ).subscribe()
  }

  private addStyle(name: string) {
    this._styles$.pipe(
      take(1),
      map(styles => {
        const order = styles?.length 
          ? Math.max(...styles.map(s => s.order)) + 1
          : 0
        const style: MusicStyle = {
          order,
          name,
          id: `${Date.now()}` 
        }
        const newStyles = styles?.length ? [...styles, style] : [style]
        this.store.dispatch(updateStyle({ value: newStyles }))
      }),
      tap(console.log)
    ).subscribe()
  }


}
