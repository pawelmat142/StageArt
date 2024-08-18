import { Component, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { PanelBookingsComponent } from '../../../booking/view/panel-bookings/panel-bookings.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { InitialInfoComponent } from '../../../artist/view/initial-info/initial-info.component';
import { PanelArtistsComponent } from '../../../artist/view/panel-artists/panel-artists.component';

export type PanelView  = 'NONE' | 'BOOKINGS' | 'MANAGER_ARTISTS' | 'ARTIST_INITIAL_INFO'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    BtnComponent,
    HeaderComponent,
    SidebarComponent,
    InitialInfoComponent,
    PanelBookingsComponent,
    PanelArtistsComponent
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PanelComponent {

  public static readonly path = 'profile'

  _profileView: PanelView = 'NONE' 

  _setView(view: PanelView) {
    this._profileView = view
  }
  
}
