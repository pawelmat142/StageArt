import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../controls/btn/btn.component';
import { CommonModule } from '@angular/common';
import { MenuButtonItem, NavService } from '../../nav/nav.service';

@Component({
  selector: 'app-mobile-btn',
  standalone: true,
  imports: [
    BtnComponent,
    CommonModule,
  ],
  templateUrl: './mobile-btn.component.html',
  styleUrl: './mobile-btn.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MobileBtnComponent {

  constructor(
    private readonly nav: NavService,
  ) {}

  buttons$ = this.nav.menuButtons$

  @HostBinding('class.open') open = false

  _toggle() {
    this.open = !this.open
  }

  _onMenuBtn(btn: MenuButtonItem) {
    this.open = false
    btn.onclick()
  }

}
