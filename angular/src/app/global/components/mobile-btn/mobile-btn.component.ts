import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../nav/menu-service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mobile-btn',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './mobile-btn.component.html',
  styleUrl: './mobile-btn.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MobileBtnComponent {

  constructor(
    readonly menu: MenuService,
  ) {}

  @HostBinding('class.open') open = false

  _toggle() {
    this.open = !this.open
  }

}
