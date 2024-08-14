import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfileView } from '../profile/profile.component';
import { logout, profileChange } from '../../profile.state';
import { DialogService } from '../../../global/nav/dialog.service';
import { NavService, MenuButtonItem } from '../../../global/nav/nav.service';
import { AppState } from '../../../app.state';
import { filter, map, of, switchMap, take, tap } from 'rxjs';
import { ArtistService } from '../../../artist/artist.service';
import { ProfileService } from '../../profile.service';

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
    private readonly artistService: ArtistService,
    private readonly profileService: ProfileService,
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
    this.store.select(profileChange).pipe(
      take(1),
    ).subscribe(profile => {
      if (profile?.role === 'ARTIST') {
        this._items.push({
          label: `Artist view`,
          onclick: () => this.navToArtistView()
        })
      }
    })
    this._clickItem(this._items[0])
  }

  private navToArtistView() {
    this.store.select(profileChange).pipe(
      take(1),
      map(profile => profile?.artistSignature),
      filter(signature => !!signature),
      switchMap(signature => {
        if (signature) {
          return this.artistService.findName$(signature)
        } 
        return of()
      }),
    ).subscribe(name => {
      if (name?.name) {
        this.nav.toArtist(name.name)
      } else {
        this.dialog.sww()
      }
    })
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
