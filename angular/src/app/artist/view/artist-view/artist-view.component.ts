import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../../artist/artist.service';
import { CommonModule } from '@angular/common';
import { BookFormComponent } from '../../../booking/view/book-form/book-form.component';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { MenuButtonComponent } from '../../../global/components/menu-button/menu-button.component';
import { NavService } from '../../../global/nav/nav.service';
import { DESKTOP } from '../../../global/services/device';
import { NotFoundPageComponent } from '../../../global/view/error/not-found-page/not-found-page.component';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { IconButtonComponent } from "../../../global/components/icon-button/icon-button.component";
import { AvatarComponent } from './avatar/avatar.component';
import { artist, cancelArtistChanges, editMode, initArtist, profileIsOwner, saveChanges, startEditArtist } from './artist-view.state';
import { BackgroundComponent } from './background/background.component';
import { BackgroundEditorComponent } from './background-editor/background-editor.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { BioComponent } from './bio/bio.component';
import { NameComponent } from './name/name.component';
import { MediasComponent } from './medias/medias.component';
import { StyleComponent } from './style/style.component';

@Component({
  selector: 'app-artist-view',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeaderComponent,
    MenuButtonComponent,
    BtnComponent,
    IconButtonComponent,
    AvatarComponent,
    BackgroundComponent,
    BackgroundEditorComponent,
    MatTooltipModule,
    BioComponent,
    NameComponent,
    MediasComponent,
    StyleComponent,
],
  templateUrl: './artist-view.component.html',
  styleUrl: './artist-view.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ArtistViewComponent {

  DESKTOP = DESKTOP

  public static readonly path = `artist/:name`

  artistName?: string

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private nav: NavService,
    private store: Store<AppState>,
  ) {}


  _editable$ = this.store.select(profileIsOwner)

  _editMode$ = this.store.select(editMode)

  _artist$ = this.store.select(artist)

  ngOnInit() {
    this.artistName = this.route.snapshot.paramMap.get('name') || ''
    if (!this.artistName) {
      this.nav.to(NotFoundPageComponent.path)
    } else {
      this.store.dispatch(initArtist({ name: this.artistName }))
    }
  }

  _onBookNow() {
    this.nav.to(BookFormComponent.path)
  }

  _editToggle() {
    this.store.dispatch(startEditArtist())
  }
  
  _discard() {
    this.store.dispatch(cancelArtistChanges())
  }
  
  _save() {
    this.store.dispatch(saveChanges())
  }

}
