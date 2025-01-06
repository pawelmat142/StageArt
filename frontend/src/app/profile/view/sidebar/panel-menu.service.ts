import { Injectable } from "@angular/core";
import { AppMenuItem, MenuButtonItem, NavService } from "../../../global/nav/nav.service";
import { Profile, Role } from "../../profile.model";
import { BehaviorSubject, forkJoin, map, Observable, of, take, tap } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "../../../app.state";
import { artist, initArtist } from "../../../artist/view/artist-view/artist-view.state";
import { logout, profile } from "../../profile.state";
import { MenuItem, MenuItemCommandEvent } from "primeng/api";
import { ArtistViewDto } from "../../../artist/model/artist-view.dto";
import { BookingDto } from "../../../booking/services/booking.service";

export type PanelView  = 'NONE' | 'BOOKINGS' | 'MANAGER_ARTISTS' | 'MANAGER_DATA' | 'PROMOTER_EVENTS' | 'ARTIST_INITIAL_INFO'

export interface PanelViewNav {
    view: PanelView,
    artist?: ArtistViewDto,
    booking?: BookingDto,
}

@Injectable({
    providedIn: 'root'
})
export class PanelMenuService {

    constructor(
        private readonly store: Store<AppState>,
        private readonly nav: NavService,
    ) {
        this.store.select(profile).pipe(
            tap(profile => this._profile = profile),
            tap(profile => this.setPanelViewForRole(profile)),
            tap(profile => this.initAsArtistIfNeed(profile)),
            map((profile) => {
                this.newPanelItems(profile)
            })
        ).subscribe()
    }

    _profile?: Profile

    get panelViewSubject$() {
        return this._panelViewSubject$.asObservable().pipe(
            tap(view => this.newPanelItems(this._profile))
        )
    }

    _panelViewSubject$ = new BehaviorSubject<PanelViewNav>({ view: 'NONE' })

    _items$ = new BehaviorSubject<MenuItem[]>([])

    private newPanelItems(profile?: Profile) {
        const profil = profile || this._profile
        const panelItems = this.markActiveItem(profil)
        this._items$.next([{
            label: 'Panel menu',
            items: panelItems
        }])
    }

    private markActiveItem(profile?: Profile): MenuButtonItem[] {
        const panelItems = this.allItems.filter(item => Role.matches(profile, item.rolesGuard))
        const panelView = this._panelViewSubject$.value
        if (panelView) {
            panelItems.forEach(item => {
                if (panelView.view === item.panelView) {
                    item.styleClass = 'active'
                } else {
                    item.styleClass = ''
                }
            }) 
        }
        return panelItems
    }

    _clickItem(item: AppMenuItem) {
        item.command && item.command({} as MenuItemCommandEvent)
    }

    private setPanelViewForRole(profile?: Profile) {
        const panelBookingsRolesGuard: string[] = [Role.ARTIST, Role.MANAGER, Role.PROMOTER]
        if (Role.matches(profile, panelBookingsRolesGuard)) {
            setTimeout(() => {
                this._clickItem(this._bookingsItem)
            })
        }
    }

    panelNavToArtists(artist?: ArtistViewDto) {
        this._panelViewSubject$.next({ 
            view: 'MANAGER_ARTISTS',
            artist: artist
         })
    }

    panelNavToBookings(booking?: BookingDto) {
        this._panelViewSubject$.next({ 
            view: 'BOOKINGS',
            booking: booking
         })
    }

    _bookingsItem: MenuButtonItem = {
        panelView: 'BOOKINGS',
        label: `Bookings`,
        styleClass: 'active',
        rolesGuard: [Role.ARTIST, Role.PROMOTER, Role.MANAGER],
        command: () => this.panelNavToBookings()
    }
    _artistsOfManager: MenuButtonItem = {
        panelView: 'MANAGER_ARTISTS',
        label: `Your artists`,
        rolesGuard: [Role.MANAGER],
        command: () => this.panelNavToArtists(),
    }
    _managerData: MenuButtonItem = {
        panelView: `MANAGER_DATA`,
        label: `Manager data`,
        rolesGuard: [Role.MANAGER],
        command: () => this._panelViewSubject$.next({ view: 'MANAGER_DATA' }),
    }
    _eventsOfPromoter: MenuButtonItem = {
        panelView: `PROMOTER_EVENTS`,
        label: `Your events`,
        rolesGuard: [Role.PROMOTER],
        command: () => this._panelViewSubject$.next({ view: 'PROMOTER_EVENTS' }),
    }
    _artistViewItem: MenuButtonItem = {
        label: `Artist view`,
        rolesGuard: [Role.ARTIST],
        command: () => this.navToArtistView(),
    }
    _logoutItem: MenuButtonItem = {
        label: 'Logout',
        command: () => this.logout()
    }

    private get allItems() {
        return [
            this._bookingsItem,
            this._eventsOfPromoter,
            this._artistsOfManager,
            this._managerData,
            this._artistViewItem,
            this._logoutItem,
        ]
    }

    private navToArtistView() {
        this.store.select(artist).pipe(
            take(1),
            tap(artist => {
                if (artist) {
                    this.nav.toArtist(artist?.name)
                } else {
                    this._panelViewSubject$.next({ view: 'ARTIST_INITIAL_INFO' })
                }
            })
        ).subscribe()
    }

    private logout() {
        this.store.dispatch(logout())
    }

    private initAsArtistIfNeed(profile?: Profile) {
        if (profile?.roles.includes(Role.ARTIST)) {
            if (profile.artistSignature) {
                this.store.dispatch(initArtist({ signature: profile.artistSignature }))
                this._panelViewSubject$.next({ view: 'NONE' })
            } else {
                this._panelViewSubject$.next({ view: 'ARTIST_INITIAL_INFO' })
            }
        }
    }

}