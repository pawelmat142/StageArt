import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { logout } from '../../profile.state';
import { MenuButtonItem, NavService } from '../../../services/nav/nav.service';
import { DialogService } from '../../../services/nav/dialogs/dialog.service';
import { ProfileView } from '../profile.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

  constructor(
    private readonly store: Store<AppState>,
    private readonly nav: NavService,
    private readonly dialog: DialogService,
  ) {}

  @Output() view = new EventEmitter<ProfileView>()

  _items: MenuButtonItem[] = [{
    label: `Bookings`,
    onclick: () => this.view.emit('BOOKINGS')
  }, {
    label: 'Logout',
    onclick: () => this.logout()
  }]


  private logout() {
    this.store.dispatch(logout())
    this.nav.home()
    this.dialog.simplePopup('Logged out')
  }

  _clickItem(item: MenuButtonItem) {
    this._items.forEach(item => item.active = false)
    item.active = true
    item.onclick()
  }


}
