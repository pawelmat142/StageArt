import { Component } from '@angular/core';
import { PanelBookingsComponent } from '../../../booking/view/panel-bookings/panel-bookings.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { InitialInfoComponent } from '../../../artist/view/initial-info/initial-info.component';
import { PanelArtistsComponent } from '../../../artist/view/panel-artists/panel-artists.component';
import { PanelEventsComponent } from '../../../event/view/panel-events/panel-events.component';
import { ManagerFormComponent } from "../manager-form/manager-form.component";
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuService, PanelViewNav } from '../sidebar/panel-menu.service';
import { delay, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { bookingsBreadcrumb } from '../../profile.state';
import { MenuItem } from 'primeng/api';


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
    SidebarModule,
    BreadcrumbModule,
],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class PanelComponent {  

  constructor (
    private readonly panelMenuService: PanelMenuService,
    private readonly store: Store<AppState>,
  ) {}

  _panelView$: Observable<PanelViewNav> = this.panelMenuService.panelViewSubject$

  sidebarVisible = true
  
  _breadcrumb$: Observable<MenuItem[]> = this.store.select(bookingsBreadcrumb).pipe(
    delay(0), //prevents ExpressionChangedAfterItHasBeenCheckedError
  )

}
