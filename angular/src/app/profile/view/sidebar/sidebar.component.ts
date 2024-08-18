import { Component, EventEmitter, HostBinding, Output, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { PanelView } from '../panel/panel.component';
import { logout, profile } from '../../profile.state';
import { DialogService } from '../../../global/nav/dialog.service';
import { NavService, MenuButtonItem } from '../../../global/nav/nav.service';
import { AppState, selectArtistView } from '../../../app.state';
import { BehaviorSubject, take, tap } from 'rxjs';
import { DESKTOP } from '../../../global/services/device';
import { IconButtonComponent } from '../../../global/components/icon-button/icon-button.component';
import { artist, initArtist } from '../../../artist/view/artist-view/artist-view.state';
import { CommonModule } from '@angular/common';
import { Profile, Role } from '../../profile.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

  readonly DESKTOP = DESKTOP

  constructor(
    private readonly store: Store<AppState>,
    private readonly nav: NavService,
    private readonly dialog: DialogService,
  ) {}

  @Output() view = new EventEmitter<PanelView>()

  @HostBinding('class.open') _sidebarOpened = false

  _sidebarItems$ = new BehaviorSubject<MenuButtonItem[]>([])

  _artistState$ = this.store.select(selectArtistView)

  _bookingsItem: MenuButtonItem = {
    label: `Bookings`,
    onclick: () => this.view.emit('BOOKINGS'),
  }
  _artistsOfManager: MenuButtonItem = {
    label: `Your artists`,
    rolesGuard: ['MANAGER'],
    onclick: () => this.view.emit('MANAGER_ARTISTS'),
  }
  _artistViewItem: MenuButtonItem =  {
    label: `Artist view`,
    rolesGuard: ['ARTIST'],
    onclick: () => this.navToArtistView(),
  }
  _logoutItem: MenuButtonItem  = {
    label: 'Logout',
    onclick: () => this.logout()
  }

  private readonly allItems = [
    this._bookingsItem,
    this._artistsOfManager,
    this._artistViewItem,
    this._logoutItem,
  ]

  ngOnInit(): void {
    this.store.select(profile).pipe(
      tap(profile => {
        const role = profile?.role
        if (role) {
          this.setSidebarItemsForRole(role)
          this.setPanelViewForRole(role)
        }
      }),
      tap(profile => this.initAsArtistIfNeed(profile)),
    ).subscribe()
  }

  _open() {
    if (this.DESKTOP) {
      return
    }
    this._sidebarOpened = !this._sidebarOpened
  }

  _clickItem(item: MenuButtonItem) {
    this._sidebarItems$.value.forEach(item => item.active = false)
    item.active = true
    item.onclick()
  }

  private setSidebarItemsForRole(role: Role) {
    const items = this.allItems.filter(item => item.rolesGuard ? item.rolesGuard.includes(role) : true)
    this._sidebarItems$.next(items)
  }

  private setPanelViewForRole(role: Role) {
    const showBookingsPanelViewRoles: Role[] = ['ARTIST', 'MANAGER', 'PROMOTER']
    if (showBookingsPanelViewRoles.includes(role)) {
      // TODO temp mock
      // this._clickItem(this._bookingsItem)
      this._clickItem(this._artistsOfManager)
    }
  }

  private initAsArtistIfNeed(profile: Profile | null) {
    if (profile?.role === 'ARTIST') {
      if (profile.artistSignature) {
        this.store.dispatch(initArtist({ signature: profile.artistSignature }))
        this.view.emit('NONE')
      } else {
        this._sidebarItems$.next([this._logoutItem])
        this.view.emit('ARTIST_INITIAL_INFO')
      }
    }
  }

  private navToArtistView() {
    this.store.select(artist).pipe(
      take(1),
      tap(artist => {
        if (artist) {
          this.nav.toArtist(artist?.name)
        } else {
          this.dialog.sww()
        }
      })
    ).subscribe()
  }

  private logout() {
    this.store.dispatch(logout())
    this.nav.home()
    this.dialog.simplePopup('Logged out')
  }

}
