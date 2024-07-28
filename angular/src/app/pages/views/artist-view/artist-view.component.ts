import { Component, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../../services/artist/artist.service';
import { NavService } from '../../../services/nav.service';
import { Observable, tap } from 'rxjs';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { MenuButtonComponent } from '../../components/menu-button/menu-button.component';
import { FileViewComponent } from '../../controls/file-loader/file-view/file-view.component';
import { CountryComponent } from "../../components/country/country.component";
import { TextareaElementComponent } from "../../controls/textarea-element/textarea-element.component";
import { MediaItemComponent } from '../../components/media-item/media-item.component';
import { ButtonComponent } from '../../controls/button/button.component';
import { IconButtonComponent } from "../../components/icon-button/icon-button.component";
import { BtnComponent } from '../../controls/btn/btn.component';

@Component({
  selector: 'app-artist-view',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeaderComponent,
    MenuButtonComponent,
    FileViewComponent,
    CountryComponent,
    TextareaElementComponent,
    MediaItemComponent,
    ButtonComponent,
    BtnComponent,
],
  templateUrl: './artist-view.component.html',
  styleUrl: './artist-view.component.scss'
})
export class ArtistViewComponent {

  public static readonly path = `artist/:name`

  artistName?: string
  _artist$?: Observable<ArtistViewDto>

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private nav: NavService,
  ) {}


  @ViewChild('backgroundRef') backgroundRef!: ElementRef
  @ViewChildren('image', { read: ElementRef }) images!: ElementRef[]

  _artist?: ArtistViewDto

  ngOnInit() {
    this.artistName = this.route.snapshot.paramMap.get('name') || ''
    if (!this.artistName) {
      this.nav.toNotFound()
      return
    }
    this.fetchArtist()
  }


  private fetchArtist() {
    this._artist$ = this.artistService.fetchArtist$(this.artistName!).pipe(
      tap(this.initArtist)
    )
  }

  private initArtist = (artist: ArtistViewDto) => {
    this._artist = artist
  }

  _onBookNow() {
    console.log('onbooknow')
  }

}
