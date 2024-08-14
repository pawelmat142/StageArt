import { Component, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { BookingsComponent } from '../../../booking/view/bookings/bookings.component';
import { PinViewComponent } from '../../auth/view/pin-view/pin-view.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../../../global/components/header/header.component';

export type ProfileView  = 'NONE' | 'BOOKINGS'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    BtnComponent,
    HeaderComponent,
    PinViewComponent,
    SidebarComponent,
    BookingsComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent {

  public static readonly path = 'profile'

  constructor(
  ) {}

  _profileView: ProfileView = 'NONE' 

  _setView(view: ProfileView) {
    this._profileView = view
  }

}
