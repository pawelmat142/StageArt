import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { addBgImage, editMode, loadingArtistView } from '../artist-view.state';
import { ImgUtil } from '../../../../global/utils/img.util';
import { take, tap } from 'rxjs';
import { FireImgStorageService } from '../../../../global/services/fire-img-storage.service';

@Component({
  selector: 'app-background-editor',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './background-editor.component.html',
  styleUrl: './background-editor.component.scss'
})
export class BackgroundEditorComponent {

  constructor(
    private readonly imgService: FireImgStorageService,
    private readonly store: Store<AppState>,
  ) {}

  _editMode$ = this.store.select(editMode)


  @ViewChild('input') input?: ElementRef<HTMLInputElement>

  _editBackground = false
  
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
      const valid = this.imgService.validateExtension(file)
      if (valid) {
        this.convertAndSetTempBackgroundImg(file)
      }
    }
  }

  private async convertAndSetTempBackgroundImg(value: File | null) {
    if (value) {
      this.store.dispatch(loadingArtistView())
      ImgUtil.resizeImgFile$(value).pipe(
        take(1),
        tap(file => this.store.dispatch(addBgImage({ file: file }))),
      ).subscribe()
    }
  }
}

