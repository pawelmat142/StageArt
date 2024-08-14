import { Component, ElementRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../../artist/artist.service';
import { Observable } from 'rxjs';
import { ArtistViewDto } from '../../../artist/model/artist-view.dto';
import { CommonModule } from '@angular/common';
import { BookFormComponent } from '../../../booking/view/book-form/book-form.component';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { ButtonComponent } from '../../../global/controls/button/button.component';
import { FileViewComponent } from '../../../global/controls/file-loader/file-view/file-view.component';
import { CountryComponent } from '../../../global/components/country/country.component';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { MediaItemComponent } from '../../../global/components/media-item/media-item.component';
import { MenuButtonComponent } from '../../../global/components/menu-button/menu-button.component';
import { NavService } from '../../../global/nav/nav.service';
import { DESKTOP } from '../../../global/services/device';
import { TextareaElementComponent } from '../../../global/controls/textarea-element/textarea-element.component';
import { NotFoundPageComponent } from '../../../global/view/error/not-found-page/not-found-page.component';

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
  styleUrl: './artist-view.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArtistViewComponent {

  DESKTOP = DESKTOP

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

  ngOnInit() {
    this.artistName = this.route.snapshot.paramMap.get('name') || ''
    if (!this.artistName) {
      this.nav.to(NotFoundPageComponent.path)
    } else {
      this.fetchArtist()
    }
  }


  private fetchArtist() {
    this._artist$ = this.artistService.fetchArtist$(this.artistName!).pipe(
    )
  }

  _onBookNow() {
    this.nav.to(BookFormComponent.path)
  }

}
