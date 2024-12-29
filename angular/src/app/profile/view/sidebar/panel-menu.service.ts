import { Injectable } from "@angular/core";
import { AppMenuItem, MenuButtonItem, NavService } from "../../../global/nav/nav.service";
import { Profile, Role } from "../../profile.model";
import { map, Observable, Subject, take, tap } from "rxjs";
import { PanelView } from "../panel/panel.component";
import { Store } from "@ngrx/store";
import { AppState } from "../../../app.state";
import { artist, initArtist } from "../../../artist/view/artist-view/artist-view.state";
import { logout, profile } from "../../profile.state";
import { MenuItem, MenuItemCommandEvent } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class PanelMenuService {

    constructor(
        private readonly store: Store<AppState>,
        private readonly nav: NavService,
    ) { }

    panelViewSubject$ = new Subject<PanelView>()

    _items$: Observable<MenuItem[]> = this.store.select(profile).pipe(
        tap(profile => this.setPanelViewForRole(profile)),
        tap(profile => this.initAsArtistIfNeed(profile)),
        map(profile => this.allItems
            .filter(item => Role.matches(profile, item.rolesGuard))
        ),
        map(panelItems => [{
            label: 'Panel menu',
            items: panelItems
        }]),
    )

    _clickItem(item: AppMenuItem) {
        item.command && item.command({} as MenuItemCommandEvent)
    }

    private setPanelViewForRole(profile?: Profile) {
        const panelBookingsRolesGuard: string[] = [Role.ARTIST, Role.MANAGER, Role.PROMOTER]
        if (Role.matches(profile, panelBookingsRolesGuard)) {
            this._clickItem(this._bookingsItem)
        }
    }

    _bookingsItem: MenuButtonItem = {
        label: `Bookings`,
        styleClass: 'active',
        rolesGuard: [Role.ARTIST, Role.PROMOTER, Role.MANAGER],
        command: () => this.panelViewSubject$.next('BOOKINGS'),
    }
    _artistsOfManager: MenuButtonItem = {
        label: `Your artists`,
        rolesGuard: [Role.MANAGER],
        command: () => this.panelViewSubject$.next('MANAGER_ARTISTS'),
    }
    _managerData: MenuButtonItem = {
        label: `Manager data`,
        rolesGuard: [Role.MANAGER],
        command: () => this.panelViewSubject$.next('MANAGER_DATA'),
    }
    _eventsOfPromoter: MenuButtonItem = {
        label: `Your events`,
        rolesGuard: [Role.PROMOTER],
        command: () => this.panelViewSubject$.next('PROMOTER_EVENTS'),
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
                    this.panelViewSubject$.next('ARTIST_INITIAL_INFO')
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
                this.panelViewSubject$.next('NONE')
            } else {
                this.panelViewSubject$.next('ARTIST_INITIAL_INFO')
            }
        }
    }

}