import { Component } from '@angular/core';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { editMode, updateLabels, updateStyle } from '../artist-view.state';
import { filter, map, take, tap, withLatestFrom } from 'rxjs';
import { ArtistService } from '../../../artist.service';
import { Dialog, DialogData } from '../../../../global/nav/dialog.service';
import { ArtistLabel, ArtistStyle } from '../../../model/artist-view.dto';
import { Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { IconComponent } from '../../../../global/components/icon/icon.component';
import { $desktop } from '../../../../global/tools/media-query';


@Component({
  selector: 'app-style',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    IconComponent,
  ],
  templateUrl: './style.component.html',
  styleUrl: './style.component.scss',
})
export class StyleComponent {

  readonly $desktop = $desktop

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: Dialog,
    private readonly artistService: ArtistService,
  ) {}

  _editable$ = this.artistService.artistViewEditable$

  _styles$ = this.store.select(state => state.artistViewState.artist?.styles).pipe(
    tap(styles => this._canRemoveStyle = (styles || [])?.length > 1)
  )

  _labels$ = this.store.select(state => state.artistViewState.artist?.labels).pipe(
    tap(labels => this._labels = labels || [])
  )

  _canRemoveStyle = false
  _labels: ArtistLabel[] = []

  _editMode$ = this.store.select(editMode).pipe(
    tap(editMode => this._editMode = editMode)
  )

  _editMode = false

  _addStyle() {
    this.artistService.listMusicStyles$().pipe(
      take(1),
      withLatestFrom(this._styles$),
      tap(([allStyles, _artistStyles]) => {
        let artistStyles = _artistStyles || []
        const stylesToSelect = allStyles.filter(s => !artistStyles?.map(as => as.id).includes(s.id))
        const data: DialogData = {
          header: stylesToSelect.length 
          ? 'Select music style or add new'
          : 'Add music style',
          chips: stylesToSelect,
          input: 'style',
          inputValidators: [Validators.required]
        }
        this.dialog.popup(data).onClose.pipe(
          filter(name => !!name && typeof name === 'string'),
          map((styleName) => {
            let artistStyles = _artistStyles || []
            const foundStyle = allStyles.find(s => s.name === styleName)
            if (foundStyle) {
              return [...artistStyles, foundStyle]
            } else {
              const newStyle = {
                name: styleName as string,
                // order: Math.max(...(artistStyles?.map(s => s.order) || [])) + 1,
                id: `${Date.now()}`,
              }
              return [...artistStyles, newStyle]
            }
          }),
          tap(styles => this.store.dispatch(updateStyle({ value: styles })))
        ).subscribe()
      })
    ).subscribe()
  }

  _removeStyle(style: ArtistStyle) {
    this._styles$.pipe(
      take(1),
      tap(styles => {
        const newStyles = styles?.filter(s => s.id !== style.id) || []
        this.store.dispatch(updateStyle({ value: newStyles }))
      })
    ).subscribe()
  }

  _addLabel() {
    this.artistService.listArtistLabels$().pipe(
      take(1),
      withLatestFrom(this._labels$),
      tap(([allLabels, _artistLabels]) => {
        let artistLabels = _artistLabels || []
        const labelsToSelect = allLabels.filter(l => !artistLabels.map(al => al.id).includes(l.id))
        labelsToSelect.forEach(l => l.class = 'red-chip')
        const data: DialogData = {
          header: labelsToSelect.length 
          ? 'Select label or add new'
          : 'Add label',
          chips: labelsToSelect,
          input: 'label',
          inputValidators: [Validators.required]
        }
        this.dialog.popup(data).onClose.pipe(
          filter(name => !!name && typeof name === 'string'),
          map((labelName) => {
            const foundLabel = allLabels.find(s => s.name === labelName)
            if (foundLabel) {
              return [...artistLabels, foundLabel]
            } else {
              const newLabel = {
                name: labelName as string,
                id: `${Date.now()}`,
              }
              return [...artistLabels, newLabel]
            }
          }),
          tap(labels => this.store.dispatch(updateLabels({ value: labels })))
        ).subscribe()
      })
    ).subscribe()
  }

  _removeLabel(label: ArtistLabel) {
    this._labels$.pipe(
      take(1),
      tap(labels => {
        const newLabels = labels?.filter(l => l.id !== label.id) || []
        this.store.dispatch(updateLabels({ value: newLabels }))
      })
    ).subscribe()
  }

}
