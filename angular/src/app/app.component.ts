import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CourtineService } from './global/nav/courtine.service';
import { Store } from '@ngrx/store';
import { loggedIn, login, logout } from './profile/profile.state';
import { DESKTOP } from './global/services/device';
import { AppState } from './app.state';
import { ImgSize } from './global/utils/img.util';
import { ProfileService } from './profile/profile.service';
import { NavService } from './global/nav/nav.service';
import { RegisterComponent } from './profile/auth/view/register/register.component';
import { Token } from './profile/auth/view/token';
import { Theme } from './global/theme/theme';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Dialog } from './global/nav/dialog.service';
import { Path } from './global/nav/path';
import { DefaultTheme } from './global/theme/default.theme';

// TODO
export const OFFLINE_MODE = false

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProgressSpinnerModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService],
})
export class AppComponent {
  
  readonly DESKTOP = DESKTOP

  title = 'book-agency';

  constructor(
    private readonly store: Store<AppState>,
    private readonly renderer: Renderer2,
    private readonly courtineService: CourtineService,
    private readonly profileService: ProfileService,
    private readonly nav: NavService,
    private readonly messageService: MessageService,
    private readonly dialog: Dialog,
  ) {}

  courtine$ = this.courtineService.courtine$.pipe(
    
  )

  ngOnInit() {
    if (DESKTOP) {
      this.renderer.addClass(document.body, 'desktop')
    }

    this.autoLogin()
    this.initScssVariables()

    this.dialog.toast$.subscribe(message => {
      this.messageService.add(message)
    })
  }


  private autoLogin() {
    if (OFFLINE_MODE || this.skipAutoLogin()) {
      return
    }
    if (!Token.token) {
      return
    }
    this.store.dispatch(login())
    this.profileService.refreshToken$().pipe(
    ).subscribe({
      next: token => this.store.dispatch(loggedIn(token)),
      error: error => {
        this.store.dispatch(logout())
      }
    })
  }

  private skipAutoLogin(): boolean {
    return [Path.LOGIN, RegisterComponent.path].some(path => this.nav.path.includes(path))
  }

  private initScssVariables() {
    const avatarSize = DESKTOP ? ImgSize.avatar.height : ImgSize.avatarMobile.height
    Theme.cssVar('avatar-size',`${avatarSize}px`)
    Theme.setTheme(DefaultTheme)
  }

}

