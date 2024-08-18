import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { editMode, updateStyle } from '../artist-view.state';
import { tap } from 'rxjs';
import { TextareaElementComponent } from '../../../../global/controls/textarea-element/textarea-element.component';

@Component({
  selector: 'app-style',
  standalone: true,
  imports: [
    CommonModule,
    TextareaElementComponent
  ],
  templateUrl: './style.component.html',
  styleUrl: './style.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class StyleComponent {
  
  constructor(
    private readonly store: Store<AppState>,
  ) {}

  @ViewChild(TextareaElementComponent) textarea?: TextareaElementComponent

  _styles$ = this.store.select(state => state.artistViewState.artist?.style).pipe(
  )

  _editMode$ = this.store.select(editMode).pipe(
    tap(mdoe => {
      if (!mdoe) {
        this._editStyleMode = false
      }
    })
  )

  _editStyleMode = false

  _edit() {
    this._editStyleMode = !this._editStyleMode
    if (this._editStyleMode) {
      setTimeout(() => {
        this.textarea?.focusTextarea()
      }, 100)
    }
  }

  _onInput(event: Event)  {
    const input = event.target as HTMLTextAreaElement;
    this.store.dispatch(updateStyle({ value: input?.value }))
  }

}
