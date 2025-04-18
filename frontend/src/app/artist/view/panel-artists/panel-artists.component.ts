import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ArtistService } from '../../artist.service';
import { Observable, of, tap } from 'rxjs';
import { ArtistStatus, ArtistViewDto } from '../../model/artist-view.dto';
import { StatusPipe } from "../../../global/pipes/status.pipe";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CourtineService } from '../../../global/nav/courtine.service';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import {  MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PanelArtistSectionComponent } from "./panel-artist-section/panel-artist-section.component";
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { setBookingsBreadcrumb } from '../../../profile/profile.state';
import { BreadcrumbUtil } from '../../../booking/breadcrumb.util';

@Component({
  selector: 'app-panel-artists',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StatusPipe,
    AccordionModule,
    TooltipModule,
    ButtonModule,
    MenuModule,
    PanelArtistSectionComponent
],
  templateUrl: './panel-artists.component.html',
  styleUrl: './panel-artists.component.scss',
})
export class PanelArtistsComponent {

  constructor(
    private readonly artistService: ArtistService,
    private readonly courtineService: CourtineService,
    private readonly store: Store<AppState>,
  ) {}

  @Input() artist?: ArtistViewDto

  _artists$: Observable<ArtistViewDto[]> = of([])

  _documentTemplatesArtist?: ArtistViewDto

  ngOnInit(): void {
    this.setBreadcrumb(BreadcrumbUtil.artists())
    
    if (this.artist) {
      this._select(this.artist)
      return
    }
    this.loadArtists()
  }

  _artistBreadcrubs(items?: MenuItem[]) {
    const breadcrumb = BreadcrumbUtil.artists()
    if (items) {
      breadcrumb.push(...items)
    }
    if (this._selectedArtist && !items) {
      breadcrumb.push({
        label: this._selectedArtist.name,
      })
    }
    this.setBreadcrumb(breadcrumb)
  }

  _selectedArtist?: ArtistViewDto

  _select(artist?: ArtistViewDto) {
    this._selectedArtist = artist
    this._artistBreadcrubs()
  }

  _cancelManagementNotesEdit() {
    this._select(undefined)
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

  _artistStatusTooltip(status: ArtistStatus): string {
    if (status === 'CREATED') {
      return `When artist finishes editing his view, you will be able to make it public`
    }
    if (status === 'READY') {
      return `Artist view is ready, you can publish it`
    }
    return ''
  }

  loadArtists() {
    this.courtineService.startCourtine()
    this._artists$ = this.artistService.fetchArtistsOfManager$().pipe(
      tap(() => {
        this._cancelManagementNotesEdit()
        this.courtineService.stopCourtine()
      })
    )
  }

  private setBreadcrumb(breadcrumb: MenuItem[]) {
    this.store.dispatch(setBookingsBreadcrumb({ value: breadcrumb }))
  }

}
