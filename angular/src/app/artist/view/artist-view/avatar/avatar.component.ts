import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ArtistViewDto } from '../../../model/artist-view.dto';
import { FireImgSet } from '../../../model/artist-form';
import { ImgUtil } from '../../../../global/utils/img.util';
import { filter, map, switchMap, take, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppState } from '../../../../app.state';
import { Store } from '@ngrx/store';
import { artist, artistAvatar, load, selectAvatar } from '../artist-view.state';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AvatarComponent {

  constructor(
    private cdRef: ChangeDetectorRef,
    private readonly store: Store<AppState>
  ) {}

  @Input() editMode!: boolean

  @Input() artist!: ArtistViewDto

  _avatarSet?: FireImgSet

  @ViewChild('input') input?: ElementRef<HTMLInputElement>

  ngOnInit(): void {
    if (!this.artist.images) {
      this.artist.images = {}
    }
    this._avatarSet = this.artist.images.avatar
  }

  tempAvatar$ = this.store.select(artistAvatar).pipe(
    filter(file => !!file),
    map(file => ImgUtil.fileToBlob(file)),
    switchMap(blob => ImgUtil.blobToBase64$(blob)),
    tap(() => this.cdRef.detectChanges())
  )

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
        tap(file => this.store.dispatch(selectAvatar({ file: file }))),
      ).subscribe()
    }
  }

  _openFileSelector() {
    this.input?.nativeElement?.click()
  }

}
