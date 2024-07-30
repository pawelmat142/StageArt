import { Component, HostBinding, ViewEncapsulation } from '@angular/core';
import { BtnComponent } from '../../controls/btn/btn.component';
import { MenuButtonItem, NavService } from '../../../services/nav.service';

@Component({
  selector: 'app-mobile-btn',
  standalone: true,
  imports: [
    BtnComponent
  ],
  templateUrl: './mobile-btn.component.html',
  styleUrl: './mobile-btn.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MobileBtnComponent {

  constructor(
    private readonly nav: NavService,
  ) {}

  buttons: MenuButtonItem[] = []

  @HostBinding('class.open') open = false

  ngOnInit() {
    this.buttons = this.nav.menuButtons
  }

  _toggle() {
    this.open = !this.open
  }


}
