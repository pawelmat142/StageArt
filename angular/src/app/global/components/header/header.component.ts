import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LogoComponent } from '../logo/logo.component';
import { NavService } from '../../nav/nav.service';
import { MobileBtnComponent } from '../mobile-btn/mobile-btn.component';
import { MenuService } from '../../nav/menu-service';

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
})
export class HeaderComponent {

  constructor(
    private readonly nav: NavService,
    readonly menu: MenuService,
  ) {}

  @Input() label?: string
  @Input() floating = false

  @HostBinding('class.show') show = false

  menuButtonOverhiddenSubsciption?: Subscription

  ngOnInit() {
    if (this.floating) {
      this.menuButtonOverhiddenSubsciption = this.nav.menuButtonOverhidden$.subscribe(menuButtonOverhidden => {
        this.show = menuButtonOverhidden
      })
    } else {
      this.show = true
    }
  }

  ngOnDestroy() {
    this.menuButtonOverhiddenSubsciption?.unsubscribe()
  }

  _home() {
    this.nav.home()
  }

}
