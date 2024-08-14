import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfileView } from '../profile/profile.component';
import { logout } from '../../profile.state';
import { DialogService } from '../../../global/nav/dialog.service';
import { NavService, MenuButtonItem } from '../../../global/nav/nav.service';
import { AppState } from '../../../app.state';

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

  ngOnInit(): void {
    this._clickItem(this._items[0])
  }


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
