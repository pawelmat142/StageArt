import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header.component';
import { CountriesService } from '../../../../services/countries/countries.service';
import { countryValidator } from '../../../../services/countries/countries.validator';
import { CommonModule } from '@angular/common';
import { ArtistMediasService, ArtistMediaCode, ArtistMedia } from '../../../../services/artist/artist-medias/artist-medias.service';
import { Util } from '../../../../utils/util';
import { mediaValidator } from '../../../../services/artist/artist-medias/media.validator';
import { InputComponent } from '../../../controls/input/input.component';
import { ButtonComponent } from '../../../controls/button/button.component';
import { SelectorComponent, SelectorItem } from '../../../controls/selector/selector.component';
import { FileLoaderComponent } from '../../../controls/file-loader/file-loader.component';
import { FileViewComponent } from '../../../controls/file-loader/file-view/file-view.component';
import { ArtistForm, FireImg, Images } from '../../../../services/artist/model/artist-form';
import { ArtistService } from '../../../../services/artist/artist.service';
import { catchError, concatMap, filter, forkJoin, map, noop, of } from 'rxjs';
import { NavService } from '../../../../services/nav/nav.service';
import { TextareaElementComponent } from '../../../controls/textarea-element/textarea-element.component';
import { TextareaComponent } from '../../../controls/textarea/textarea.component';
import { Country } from '../../../../services/countries/country.model';
import { ArtistsViewComponent } from '../../../views/artists-view/artists-view.component';
import { Store } from '@ngrx/store';
import { fetchArtists } from '../../../../store/artist/artists.state';
import { FireImgStorageService } from '../../../../services/fire-img-storage.service';
import { ImgSize, ImgUtil } from '../../../../utils/img.util';
import { FormUtil } from '../../../../utils/form.util';
import { BtnComponent } from '../../../controls/btn/btn.component';


@Component({
  selector: 'app-add-artist',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonComponent,
    HeaderComponent,
    SelectorComponent,
    FileLoaderComponent,
    FileViewComponent,
    TextareaElementComponent,
    TextareaComponent,
    BtnComponent,
],
  templateUrl: './artist-form.component.html',
  styleUrl: './artist-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ArtistFormComponent {

  public static readonly path = 'artist-form'

  constructor(
    private readonly countriesService: CountriesService,
    private readonly artistMediasService: ArtistMediasService,
    private readonly artistService: ArtistService,
    private readonly fireImgStorageService: FireImgStorageService,
    private readonly fb: FormBuilder,
    private readonly nav: NavService,
    private readonly store: Store,
  ) {}

  private phoneNumberRegex = /^\+?(\d{1,4})?[-. ]?(\(?\d+\)?)?[-. ]?\d+[-. ]?\d+[-. ]?\d+$/;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    country: new FormControl('', [countryValidator(this.countriesService)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberRegex)]),
    medias: this.fb.array<FormGroup>([]),

    avatar: new FormControl<File | null>(null, Validators.required),
    images: this.fb.array<File>([]),
    bio: new FormControl(''),
  })

  get f() { return this.form.controls }

  _countryItems: SelectorItem[] = []
  _mediaItems: SelectorItem[] = []
  _mediaItemsNotSelected: SelectorItem[] = []
  _everyMediaTypeSelected = false

  artistMedias: ArtistMediaCode[] = []

  get _avatarFileName(): string {
    return `${this.form.controls.name.value?.replace(' ', '_')}-avatar.jpg`
  }

  _imageFileName(index: number): string {
    return `${this.form.controls.name.value?.replace(' ', '_')}-bg-${index}.jpg`
  }


  ngOnInit() {
    this._countryItems = this.countriesService.getCountries()

    this._mediaItems = this.artistMediasService.getMedias().filter(type => !!type).map(mediaType => {
      return {
        code: mediaType,
        name: Util.capitalizeFirstLetter(mediaType),
        svg: mediaType
      }
    })

    setTimeout(() => {
      this._addMediaRow()
      this._addImage()
    }, 100)
  }


  private get EMPTY_MEDIA(): ArtistMedia {
    return { code: '', url: '' }
  }

  _selectedMedias: ArtistMedia[] = []

  get showAddButton(): boolean {
    return this.form.controls.medias.valid && this.form.controls.medias.valid
  }

  _addMediaRow() {
    this.updateSelectedMedias()
    this._selectedMedias.push(this.EMPTY_MEDIA)

    const group = this.fb.group({
      code: this.fb.control('', mediaValidator()),
      url: this.fb.control('', Validators.required)
    })

    this.form.controls.medias.push(group)
  }

  _removeMediaRow(index: number) {
    const formArray = this.form.controls.medias.controls.filter((m, i) => {
      return i !== index
    }).map(m => {
      return this.fb.group({
        code: this.fb.control(m.controls['code'].value.code, mediaValidator()),
        url: this.fb.control(m.controls['url'].value, Validators.required)
      })
    })
    this.form.controls.medias = this.fb.array(formArray)
  }

  _controlMediaTypeValid(index: number) {
    return this.f.medias.controls.at(index)?.controls['code'].valid
  }

  private updateSelectedMedias() {
    this._everyMediaTypeSelected = this._selectedMedias.length === this._mediaItems.length
    this.updateAvailableMediaTypes()
    this._selectedMedias = this.form.controls.medias.controls.map(mediaFormGroup => {
      return {
        code: mediaFormGroup.controls['code'].value.code,
        url: mediaFormGroup.controls['url'].value,
      }
    })
  }
  
  private updateAvailableMediaTypes() {
    const alreadySelectedMediaCodes = this._selectedMedias.map(item => item.code)
    const availableMediaItems = this._mediaItems.filter(m => !alreadySelectedMediaCodes.includes(m.code as ArtistMediaCode))
    this._mediaItemsNotSelected = availableMediaItems
  }


  _addImage() {
    const control = this.form.controls.images.length 
      ? this.fb.control<File | null>(null, Validators.required)
      : this.fb.control<File | null>(null)
    this.form.controls.images.push(control)
  }

  _removeImage(i: number) {
    // todo
    this.form.controls.images.removeAt(i)
  }

  artist?: ArtistForm

  async _submit() {
    if (this.form.invalid) {
      FormUtil.markForm(this.form)
      return
    }
    this.updateSelectedMedias()

    const name = this.f.name.value!
    const avatarFile = this.form.controls.avatar.value
    if (!avatarFile) throw new Error('Missing avatar file')
    const imageFiles = this.form.controls.images.value || []
    if (!imageFiles.length) throw new Error('Missing background file')

    
    const imageUlopads$ = imageFiles
      .filter(file => !!file)
      .map((file, i) => this.fireImgStorageService.createFireImgSet$(file, 
        `artist/${name}/bg-${i}`, 
        [ImgSize.bg, ImgSize.miniBg, ImgSize.avatar]))

    imageUlopads$.unshift(this.fireImgStorageService.createFireImgSet$(avatarFile, 
      `artist/${name}/avatar`, 
      [ImgSize.avatar, ImgSize.mini]))

    forkJoin(imageUlopads$).pipe(
      catchError(error => this.handleUploadImagesError(error)),
      filter(fireImgs => !!fireImgs),
      map(fireImgs => ImgUtil.prepareImages(fireImgs)),
      concatMap(images => this.createArtist$(images)),
      catchError(error => this.handleCreateArtistError(error)),
    ).subscribe(artist => {
      if (artist) {
        this.store.dispatch(fetchArtists())
        this.nav.to(ArtistsViewComponent.path)
      }
    })
  }

  private createArtist$(images: Images) {
    this.artist = this.prepareArtistForm(images)
    return this.artistService.createArtist$(this.artist)
  }

  private prepareArtistForm(images: Images): ArtistForm  {
    return {
      signature: 'signature',
      name: this.f.name.value!,
      countryCode: this.f.country.value!,
      firstName: this.f.firstName.value ?? undefined,
      lastName: this.f.firstName.value ?? undefined,
      email: this.f.email.value!,
      phone: this.f.phone.value!,
      medias: this._selectedMedias.length ? this._selectedMedias : undefined,
      images: images,
      bio: this.f.bio.value!
    }
  }

  private handleUploadImagesError = (error: any) => {
    this.nav.errorPopup(`Error uploading images`)
    console.error(error)
    // TODO popup
    return of(undefined)
  }

  private handleCreateArtistError = (error: any) => {
    this.nav.errorPopup(`Error when create artist`)
    console.error(error)
    this.removeImagesFromStorage()
    // TODO popup
    return of(undefined)
  }

  private removeImagesFromStorage() {
    const deletes$ = []
    if (this.artist) {
      if (this.artist.images) {
        
        if (this.artist.images.avatar) {
          // 
          deletes$.push(this.fireImgStorageService.deleteImage$(this.artist.images.avatar.avatar!))
        }
        
        for (let fireImgSet of this.artist.images.bg || []) {
          // TODO
          if (fireImgSet.bg) {
            deletes$.push(this.fireImgStorageService.deleteImage$(fireImgSet.bg))
          }
        }
      }
    }

    forkJoin(deletes$)
    .subscribe()
  }

}
