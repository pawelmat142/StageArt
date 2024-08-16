import { Component, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { BookingsComponent } from '../../../booking/view/bookings/bookings.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../../../global/components/header/header.component';
import { InitialInfoComponent } from '../../../artist/view/initial-info/initial-info.component';

export type ProfileView  = 'NONE' | 'BOOKINGS' | 'ARTIST_INITIAL_INFO'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    BtnComponent,
    HeaderComponent,
    SidebarComponent,
    BookingsComponent,
    InitialInfoComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {

  public static readonly path = 'profile'

  _profileView: ProfileView = 'NONE' 

  _setView(view: ProfileView) {
    this._profileView = view
  }
  
}
