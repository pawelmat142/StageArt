import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ArtistService } from '../../artist.service';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { ArtistStatus, ArtistViewDto } from '../../model/artist-view.dto';
import { StatusPipe } from "../../../global/pipes/status.pipe";
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { NavService } from '../../../global/nav/nav.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextareaComponent } from '../../../global/controls/textarea/textarea.component';
import { FormUtil } from '../../../global/utils/form.util';
import { CourtineService } from '../../../global/nav/courtine.service';
import { DialogService } from '../../../global/nav/dialog.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-panel-artists',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextareaComponent,
    StatusPipe,
    MatTooltipModule,
    BtnComponent,
],
  templateUrl: './panel-artists.component.html',
  styleUrl: './panel-artists.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PanelArtistsComponent {

  constructor(
    private readonly artistService: ArtistService,
    private readonly courtineService: CourtineService,
    private readonly dialog: DialogService,
    private readonly nav: NavService,
    private readonly store: Store<AppState>,
  ) {}

  _artists$: Observable<ArtistViewDto[]> = this.artistService.fetchArtistsOfManager$()


  _artistView(artist: ArtistViewDto) {
    this.nav.toArtist(artist.name)
  }

  _selectedArtist?: ArtistViewDto

  _select(artist?: ArtistViewDto) {
    this._selectedArtist = artist
  }

  _cancel() {
    this._selectedArtist = undefined
    this.managementNotesForm = undefined
  }

  managementNotesForm?: FormGroup

  _addNotes(artist: ArtistViewDto) {
    this._select(artist)
    this.managementNotesForm = this._selectedArtist
    ? new FormGroup({
      managmentNotes: new FormControl(this._selectedArtist.managmentNotes, Validators.required)
    }) : undefined
  }

  _submitManagementNotes() {
    if (!this.managementNotesForm) {
      return
    }
    if (this.managementNotesForm.invalid) {
      FormUtil.markForm(this.managementNotesForm)
      return
    }

    const artistSignture = this._selectedArtist?.signature
    if (!artistSignture) {
      console.error(`Missing artistSignture`)
      return
    }

    this.courtineService.startCourtine()
    this.artistService.putManagementNotes$({
      managmentNotes: this.managementNotesForm.controls['managmentNotes'].value || '',
      artistSignture
    }).pipe(
    ).subscribe({
      next: () => {
        this._artists$ = this.artistService.fetchArtistsOfManager$().pipe(
          tap(artists => {
            this._cancel()
            this.courtineService.stopCourtine()
          })
        )
      }, 
      error: error => {
        this.dialog.errorPopup(error.error.message)
        this.courtineService.stopCourtine()
      }
    })
  }

  _artistStatusTooltip(status: ArtistStatus): string {
    if (status === 'CREATED') {
      return `When artist finishes editing his view, you will be able to make it public`
    }
    if (status === 'READY') {
      return `Artist view is ready, you can publish it`
    }
    return ''
  }
}
