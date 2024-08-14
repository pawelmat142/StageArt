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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'book-agency';

  constructor(
    private renderer: Renderer2,
    private courtineService: CourtineService,
    private store: Store<AppState>,
  ) {}

  ngOnInit() {
    if (DESKTOP) {
      this.renderer.addClass(document.body, 'desktop')
    }

    // TODO
    this.autoLogin()
  }

  courtine$ = this.courtineService.courtine$

  private autoLogin() {
    if (Token.loggedIn) {
      this.store.dispatch(loggedIn(Token.payload!))
    } else {
      console.log('Token not found')
    }
  }
}

