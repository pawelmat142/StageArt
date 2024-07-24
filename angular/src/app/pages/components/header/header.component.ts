import { Component, HostBinding, Input } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { MenuButtonItem, NavService } from '../../../services/nav.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private readonly nav: NavService
  ) {}

  
  @Input() label?: string
  @Input() floating = false

  @HostBinding('class.show') show = false

  menuButtonOverhiddenSubsciption?: Subscription

  menuButtons: MenuButtonItem[] = []

  ngOnInit() {
    this.menuButtons = this.nav.menuButtons
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


  home() {
    this.nav.home()
  }



}
