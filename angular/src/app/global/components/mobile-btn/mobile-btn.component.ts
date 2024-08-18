import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../controls/btn/btn.component';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../nav/menu-service';

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
    readonly menu: MenuService,
  ) {}

  @HostBinding('class.open') open = false

  _toggle() {
    this.open = !this.open
  }

}
