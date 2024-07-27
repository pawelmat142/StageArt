import { Component } from '@angular/core';
import { InputComponent } from '../../../form/input/input.component';
import { ButtonComponent } from '../../../form/button/button.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header.component';
import { SelectorComponent, SelectorItem } from '../../../form/selector/selector.component';
import { CountriesService } from '../../../../services/countries/countries.service';
import { countryValidator } from '../../../../services/countries/countries.validator';
import { CommonModule } from '@angular/common';
import { ArtistMediasService, ArtistMediaCode, ArtistMedia } from '../../../../services/artist-medias/artist-medias.service';
import { Util } from '../../../../utils/util';
import { mediaValidator } from '../../../../services/artist-medias/media.validator';
import { FileLoaderComponent } from '../../../form/file-loader/file-loader.component';
import { FileViewComponent } from '../../../form/file-loader/file-view/file-view.component';


export interface Artist {
  name: string
  country: string
  firstName?: string
  lastName?: string
  email: string
  phone: string
  medias?: ArtistMedia[]
}

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
],
  templateUrl: './add-artist.component.html',
  styleUrl: './add-artist.component.scss'
})
export class AddArtistComponent {

  constructor(
    private readonly countriesService: CountriesService,
    private readonly artistMediasService: ArtistMediasService,
    private fb: FormBuilder
  ) {}

  private phoneNumberRegex = /^\+?(\d{1,4})?[-. ]?(\(?\d+\)?)?[-. ]?\d+[-. ]?\d+[-. ]?\d+$/;

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    country: new FormControl('', [countryValidator(this.countriesService)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberRegex)]),
    medias: this.fb.array<ArtistMedia>([]),
    mediaUrls: this.fb.array<string>([]),
    avatar: new FormControl<File | null>(null, Validators.required),
    images: this.fb.array<File>([]),
  })

  get f() { return this.form.controls }

  _countryItems: SelectorItem[] = []
  _mediaItems: SelectorItem[] = []
  _mediaItemsNotSelected: SelectorItem[] = []
  _everyMediaTypeSelected = false

  artistMedias: ArtistMediaCode[] = []


  ngOnInit() {
    this._countryItems = this.countriesService.getCountries().map(c => {
      return {
        code: c.name,
        label: c.name,
        imgUrl: c.flagUrl
      }
    })

    this._mediaItems = this.artistMediasService.getMedias().filter(type => !!type).map(mediaType => {
      return {
        code: mediaType,
        label: Util.capitalizeFirstLetter(mediaType),
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
    return this.form.controls.medias.valid && this.form.controls.mediaUrls.valid
  }

  _addMediaRow() {
    this.updateSelectedMedias()
    this._selectedMedias.push(this.EMPTY_MEDIA)

    const control = this.fb.control<ArtistMedia>(this.EMPTY_MEDIA, mediaValidator())
    this.form.controls.medias.push(control)
    
    const urlControl = this.fb.control('', Validators.required)
    this.form.controls.mediaUrls.push(urlControl)
  }

  _removeMediaRow(i: number) {
    this.updateSelectedMedias()
    this._selectedMedias.splice(i, 1)
    this.rebuildMediasRows()
  }

  private updateSelectedMedias() {
    this._selectedMedias.forEach((m, i) => { 
      m.code = this.f.medias.at(i).value?.code!
      m.url = this.f.mediaUrls.at(i).value as string
    })
    this._everyMediaTypeSelected = this._selectedMedias.length === this._mediaItems.length
  
    this.updateAvailableMediaTypes()
  }
  
  private updateAvailableMediaTypes() {
    const alreadySelectedMediaCodes = this._selectedMedias.map(item => item.code)
    const availableMediaItems = this._mediaItems.filter(m => !alreadySelectedMediaCodes.includes(m.code as ArtistMediaCode))
    this._mediaItemsNotSelected = availableMediaItems
  }

  private rebuildMediasRows() {
    const mediaControls = this._selectedMedias.map(m => this.fb.control(m, mediaValidator()))
    const urlControls = this._selectedMedias.map(m => this.fb.control(m.url, Validators.required))
    this.form.controls.medias = this.fb.array(mediaControls)
    this.form.controls.mediaUrls = this.fb.array(urlControls)
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


  _submit() {
    this.updateSelectedMedias()

    const artist: Artist = {
      name: this.f.name.value!,
      country: this.f.country.value!,
      firstName: this.f.firstName.value ?? undefined,
      lastName: this.f.firstName.value ?? undefined,
      email: this.f.email.value!,
      phone: this.f.email.value!,
      medias: this._selectedMedias.length ? this._selectedMedias : undefined
    }

    console.log(artist)
  }

}
