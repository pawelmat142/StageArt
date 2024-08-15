import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { TextareaElementComponent } from '../../../../global/controls/textarea-element/textarea-element.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { artistBio, editMode, updateBio } from '../artist-view.state';
import { FormBuilder } from '@angular/forms';

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
    private readonly fb: FormBuilder,
  ) {}
  
  @ViewChild('viewRef') viewRef?: ElementRef

  _bio$ = this.store.select(artistBio).pipe(
  )

  _editMode$ = this.store.select(editMode)

  _editBioMode = false
  
  _edit() {
    this._editBioMode = !this._editBioMode
  }

  _onInput(event: Event)  {
    const input = event.target as HTMLTextAreaElement;
    this.store.dispatch(updateBio({ value: input?.value }))
  }

}
