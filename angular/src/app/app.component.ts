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
import { LoginComponent } from './profile/auth/view/login/login.component';
import { RegisterComponent } from './profile/auth/view/register/register.component';
import { Token } from './profile/auth/view/token';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
  ) {}

  courtine$ = this.courtineService.courtine$.pipe(
    
  )

  ngOnInit() {
    if (DESKTOP) {
      this.renderer.addClass(document.body, 'desktop')
    }

    this.autoLogin()
    this.initScssVariables()
  }


  private autoLogin() {
    if (this.skipAutoLogin()) {
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
    return [LoginComponent.path, RegisterComponent.path].some(path => this.nav.path.includes(path))
  }

  private initScssVariables() {
    const avatarSize = DESKTOP ? ImgSize.avatar.height : ImgSize.avatarMobile.height
    document.documentElement.style.setProperty('--avatar-size', `${avatarSize}px`);
  }
}

