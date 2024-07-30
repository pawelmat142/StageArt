import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { MenuButtonItem, NavService } from '../../../services/nav.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MenuButtonComponent } from '../menu-button/menu-button.component';
import { DESKTOP, MOBILE } from '../../../services/device';
import { MobileBtnComponent } from '../mobile-btn/mobile-btn.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    CommonModule,
    MobileBtnComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

  DESKTOP = DESKTOP

  constructor(
    private readonly nav: NavService,
  ) {}

  @Input() label?: string
  @Input() floating = false

  @HostBinding('class.show') show = false

  menuButtonOverhiddenSubsciption?: Subscription

  menuButtons: MenuButtonItem[] = []

  ngOnInit() {
    if (this.DESKTOP) {
      this.menuButtons = this.nav.menuButtons
      if (this.floating) {
        this.menuButtonOverhiddenSubsciption = this.nav.menuButtonOverhidden$.subscribe(menuButtonOverhidden => {
          this.show = menuButtonOverhidden
        })
      } else {
        this.show = true
      }
    } else {
      this.show = true
    }
  }

  ngOnDestroy() {
    this.menuButtonOverhiddenSubsciption?.unsubscribe()
  }


  home() {
    this.nav.home()
  }

}
