import { Component, EventEmitter, HostBinding, Output, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfileView } from '../profile/profile.component';
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

  @Output() view = new EventEmitter<ProfileView>()

  @HostBinding('class.open') _sidebarOpened = false

  _open() {
    if (this.DESKTOP) {
      return
    }
    this._sidebarOpened = !this._sidebarOpened
  }

  _logoutItem: MenuButtonItem  = {
    label: 'Logout',
    onclick: () => this.logout()
  }

  _bookingsItem: MenuButtonItem = {
    label: `Bookings`,
    onclick: () => this.view.emit('BOOKINGS')
  }

  _artistViewItem: MenuButtonItem =  {
    label: `Artist view`,
    onclick: () => this.navToArtistView()
  }

  _items$ = new BehaviorSubject<MenuButtonItem[]>([])

  _artistState$ = this.store.select(selectArtistView)


  ngOnInit(): void {
    this.store.select(profile).pipe(
      tap(profile => this.initAsArtistIfNeed(profile)),
      tap(profile => this.setBookingsViewIfManagerOrPromoter(profile)),
    ).subscribe()
  }


  private setBookingsViewIfManagerOrPromoter(profile: Profile | null) {
    const roles: Role[] = ['MANAGER', 'PROMOTER']
    if (profile?.role && roles.includes(profile.role)) {
      this._items$.next([
        this._bookingsItem,
        this._logoutItem,
      ])
      this._clickItem(this._bookingsItem)
    }
  }

  private initAsArtistIfNeed(profile: Profile | null) {
    if (profile?.role === 'ARTIST') {
      if (profile.artistSignature) {
        this.store.dispatch(initArtist({ signature: profile.artistSignature }))
        this._items$.next([
          this._artistViewItem,
          this._bookingsItem,
          this._logoutItem,
        ])
        this.view.emit('NONE')
      } else {
        this._items$.next([this._logoutItem])
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

  _clickItem(item: MenuButtonItem) {
    this._items$.value.forEach(item => item.active = false)
    item.active = true
    item.onclick()
  }

}
