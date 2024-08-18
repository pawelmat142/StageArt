import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CourtineService } from './global/nav/courtine.service';
import { Token } from './profile/auth/view/token';
import { Store } from '@ngrx/store';
import { loggedIn } from './profile/profile.state';
import { DESKTOP } from './global/services/device';
import { AppState } from './app.state';
import { ImgSize } from './global/utils/img.util';
import { of } from 'rxjs';

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
    private renderer: Renderer2,
    private courtineService: CourtineService,
    private store: Store<AppState>,
  ) {}

  courtine$ = of(false)

  ngOnInit() {
    if (DESKTOP) {
      this.renderer.addClass(document.body, 'desktop')
    }

    // TODO
    this.autoLogin()
    this.initCourtine()
    this.initScssVariables()
  }

  private initCourtine() {
    setTimeout(() => {
      this.courtine$ = this.courtineService.courtine$.pipe(
      )
    })
  }


  private autoLogin() {
    if (Token.loggedIn) {
      this.store.dispatch(loggedIn(Token.payload!))
    } else {
    }
  }

  private initScssVariables() {
    const avatarSize = DESKTOP ? ImgSize.avatar.height : ImgSize.avatarMobile.height
    document.documentElement.style.setProperty('--avatar-size', `${avatarSize}px`);
  }
}

