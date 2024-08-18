import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { TextareaElementComponent } from '../../../../global/controls/textarea-element/textarea-element.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { artistBio, editMode, updateBio } from '../artist-view.state';
import { tap } from 'rxjs';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [
    CommonModule,
    TextareaElementComponent,
  ],
  templateUrl: './bio.component.html',
  styleUrl: './bio.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BioComponent {

  constructor(
    private readonly store: Store<AppState>,
  ) {}

  @ViewChild(TextareaElementComponent) textarea?: TextareaElementComponent

  
  _bio$ = this.store.select(artistBio).pipe(
  )

  _editMode$ = this.store.select(editMode).pipe(
    tap(mdoe => {
      if (!mdoe) {
        this._editBioMode = false
      }
    })
  )

  _editBioMode = false
  
  _edit() {
    this._editBioMode = !this._editBioMode
    if (this._editBioMode) {
      setTimeout(() => {
        this.textarea?.focusTextarea()
      }, 100)
    }
  }

  _onInput(event: Event)  {
    const input = event.target as HTMLTextAreaElement;
    this.store.dispatch(updateBio({ value: input?.value }))
  }

}
