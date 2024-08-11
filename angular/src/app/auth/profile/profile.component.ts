import { Component, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../pages/controls/btn/btn.component';
import { HeaderComponent } from '../../pages/components/header/header.component';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';
import { FormGroup } from '@angular/forms';
import { PinViewComponent } from '../pin-view/pin-view.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../pages/components/popup/popup.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    BtnComponent,
    HeaderComponent,
    PinViewComponent
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

  form = new FormGroup({})

  _spinner = false

  _token?: string

  ngOnInit(): void {
    this.pinViewIfTokenExists()
  }

  _logout() {
  }


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
