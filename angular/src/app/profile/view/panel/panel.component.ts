import { Component, OnInit } from '@angular/core';
import { PanelBookingsComponent } from '../../../booking/view/panel-bookings/panel-bookings.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { InitialInfoComponent } from '../../../artist/view/initial-info/initial-info.component';
import { PanelArtistsComponent } from '../../../artist/view/panel-artists/panel-artists.component';
import { PanelEventsComponent } from '../../../event/view/panel-events/panel-events.component';
import { ManagerFormComponent } from "../manager-form/manager-form.component";
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuService } from '../sidebar/panel-menu.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

export type PanelView  = 'NONE' | 'BOOKINGS' | 'MANAGER_ARTISTS' | 'MANAGER_DATA' | 'PROMOTER_EVENTS' | 'ARTIST_INITIAL_INFO'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    InitialInfoComponent,
    PanelBookingsComponent,
    PanelArtistsComponent,
    PanelEventsComponent,
    ManagerFormComponent,
    SidebarModule
],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class PanelComponent {  

  constructor (
    private readonly panelMenuService: PanelMenuService
  ) {}

  _panelView$: Observable<PanelView> = this.panelMenuService.panelViewSubject$

  sidebarVisible = true
  
}
