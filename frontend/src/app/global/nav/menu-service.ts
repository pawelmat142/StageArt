import { Injectable } from "@angular/core";
import { MenuButtonItem, NavService } from "./nav.service";
import { profile } from "../../profile/profile.state";
import { AppState } from "../../app.state";
import { Store } from "@ngrx/store";
import { Location } from '@angular/common';
import { Profile } from "../../profile/profile.model";
import { map, Observable, shareReplay } from "rxjs";
import { HomepageComponent } from "../view/homepage/homepage.component";
import { Path } from "./path";
import { Theme } from "../theme/theme";
import { MenuItemCommandEvent } from "primeng/api";


@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor(
        private readonly store: Store<AppState>,
        private readonly nav: NavService,
    ) {}

    public menuBtns$: Observable<MenuButtonItem[]> = this.store.select(profile).pipe(
        map(profile => {
            return this.allButtons
                .filter(btn => btn.filter ? btn.filter(profile) : true)
                .map(btn => {
                    if (btn.path === this.nav.path.replace('/', '')) {
                        btn.styleClass = 'active'
                    }
                    return btn
                })
        }),
        shareReplay()
    )

    public menuReversed$ = this.menuBtns$.pipe(
        map(btns => btns.slice().reverse())
    )

    public command(item: MenuButtonItem) {
        if (item.path) {
            this.nav.to(item.path)
        }
        if (item.command) {
            item.command({} as MenuItemCommandEvent)
        }
    }

    private readonly homeButton: MenuButtonItem  = {
        label: 'Home',
        path: HomepageComponent.path,
    }
    private readonly panelButton: MenuButtonItem  = {
        label: 'Panel',
        path: Path.PANEL ,
        filter: (profile?: Profile) => !!profile, 
    }
    private readonly bookNowButton: MenuButtonItem  = {
        label: 'Book now',
        command: () => {
            this.nav.bookNow()
        }
    }
    private readonly artistsButton: MenuButtonItem  = {
        label: 'Artists',
        path: Path.ARTISTS_LIST_VIEW,
    }
    private readonly loginButton: MenuButtonItem  = {
        label: 'Login',
        path: Path.LOGIN,
        filter: (profile?: Profile) => !profile, 
    }

    private readonly test: MenuButtonItem = {
        label: 'theme',
        command: () => {
            Theme.switchTheme()
        }
    }

    private allButtons: MenuButtonItem[] = [
        this.test,//TODO move somewhere else

        this.homeButton,
        this.artistsButton,
        this.bookNowButton,
        this.panelButton,
        this.loginButton,
    ]

}
