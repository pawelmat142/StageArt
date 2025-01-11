import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { Dialog } from '../../nav/dialog.service';
import { IconComponent } from '../icon/icon.component';
import { NavService } from '../../nav/nav.service';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { logout, profile } from '../../../profile/profile.state';
import { $desktop } from '../../tools/media-query';
import { Theme } from '../../theme/theme';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    LogoComponent,
    IconComponent,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  $desktop = $desktop

  constructor(
    private readonly dialog: Dialog,
    private readonly store: Store<AppState>,
    private readonly nav: NavService
  ) {}

  profile$ = this.store.select(profile)

  async _clipboard(content: string) {
    await navigator.clipboard.writeText(content)
    this.dialog.succesToast(content, `Copied to clipboard`)
  }

  _nav(path: string) {
    this.nav.to(path)
  }

  _bookNow() {
    this.nav.bookNow()
  }

  _logout() {
    this.store.dispatch(logout())
  }

  _switchTheme() {
    Theme.switchTheme()
  }

}
