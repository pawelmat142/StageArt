import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { addBgImage, editMode, load } from '../artist-view.state';
import { ImgUtil } from '../../../../global/utils/img.util';
import { take, tap } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-background-editor',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './background-editor.component.html',
  styleUrl: './background-editor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BackgroundEditorComponent {

  constructor(
    private readonly store: Store<AppState>
  ) {}

  _editMode$ = this.store.select(editMode)


  @ViewChild('input') input?: ElementRef<HTMLInputElement>

  // TODO mock
  // _editBackground = false
  _editBackground = true
  
  _toggleEditBackground() {
    this._editBackground = !this._editBackground
  }

  _openFileSelector() {
    this.input?.nativeElement?.click()
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.convertAndSetTempAvatar(file)
    }
  }

  private async convertAndSetTempAvatar(value: File | null) {
    if (value) {
      this.store.dispatch(load())
      ImgUtil.resizeImgFile$(value).pipe(
        take(1),
        tap(file => this.store.dispatch(addBgImage({ file: file }))),
      ).subscribe()
    }
  }
}

