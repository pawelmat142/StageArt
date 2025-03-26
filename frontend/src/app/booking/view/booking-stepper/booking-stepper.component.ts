import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { BookingDto,  } from '../../services/booking.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PaperTileComponent } from '../../../global/components/paper-tile/paper-tile.component';
import { ChecklistTile } from '../../interface/checklist.interface';
import { ChecklistUtil } from '../../checklist.util';
import { Token } from '../../../profile/auth/view/token';
import { SelectorItem } from '../../../global/interface';
import { PanelMenuService } from '../../../profile/view/sidebar/panel-menu.service';
import { ArtistService } from '../../../artist/artist.service';
import { NavService } from '../../../global/nav/nav.service';
import { BookingFormStepComponent } from "../booking-form-step/booking-form-step.component";

export interface SelectorItemWithPersmission extends SelectorItem {
  hasPermission?: boolean
}

@Component({
  selector: 'app-booking-stepper',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    StepperModule,
    PaperTileComponent,
    ButtonModule,
    BookingFormStepComponent
],
  templateUrl: './booking-stepper.component.html',
  styleUrl: './booking-stepper.component.scss',
})
export class BookingStepperComponent implements OnChanges{

  constructor(
    private readonly nav: NavService,
    private readonly panelMenuService: PanelMenuService,
    private readonly artistService: ArtistService,
  ) {}

  activeStep = 0;

  _uid = Token.getUid()
  _profile = Token.payload

  _checklistTiles: ChecklistTile[] = []
  _artists: SelectorItemWithPersmission[] = []

  @Input() booking!: BookingDto

  ngOnChanges(changes: SimpleChanges): void {
    this.setProcessStepIndex(this.booking)
    this._checklistTiles = this.booking?.checklist.length && this._uid 
      ? ChecklistUtil.prepareTiles(this.booking, this._uid)
      : []

    const isManager = this.booking.managerUid === this._uid

    this._artists = this.booking.artists.map(a => {
      let artist = {...a} as SelectorItemWithPersmission
      artist.hasPermission = isManager
      return artist
    })
  }

  _navToArtist(artist: SelectorItemWithPersmission) {
    if (artist.hasPermission) {
      this.artistService.fetchArtist$({ signature: artist.code }).pipe(
        map((a) => this.panelMenuService.panelNavToArtists(a))
      ).subscribe()
    } else {
      this.nav.toArtist(artist.name)
    }
  }

  private setProcessStepIndex(booking?: BookingDto) {
    if (booking?.status === 'SUBMITTED') {
      this.activeStep = 0
    }
    if (booking?.status === 'DOCUMENTS') {
      this.activeStep = 1
    }
    if (booking?.status === 'CHECKLIST_COMPLETE') {
      this.activeStep = 2
    }
  }
  
}
