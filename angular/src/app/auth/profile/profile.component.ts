import { Component, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../pages/controls/btn/btn.component';
import { HeaderComponent } from '../../pages/components/header/header.component';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { PinViewComponent } from '../pin-view/pin-view.component';
import { MatDialog } from '@angular/material/dialog';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BookingsComponent } from '../../booking/view/bookings/bookings.component';

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
    private readonly profileService: ProfileService,
    private router: Router,
    private readonly dialog: MatDialog,
  ) {}

  _profileView: ProfileView = 'NONE' 

  _spinner = false


  ngOnInit(): void {
    this.pinViewIfTokenExists()
  }


  _setView(view: ProfileView) {
    this._profileView = view
  }



  // TODO
  _token?: string


  private pinViewIfTokenExists() {
    const urlSplit = this.router.url.split('/')
    if (urlSplit.includes('telegram')) {
      const token = urlSplit.pop()
      if (token) {
        this._token = token
        this.showPinPopup()
      }
    }
  }

  private showPinPopup() {
    this.dialog.open(PinViewComponent, { data: { token: this._token } })
  }

}
