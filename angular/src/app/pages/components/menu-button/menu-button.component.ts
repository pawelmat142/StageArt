import { Component, HostBinding } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { NavService } from '../../../services/nav.service';
import { CommonModule } from '@angular/common';

export interface MenuButtonItem {
  label: string
  onclick(): void
}

@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss'
})
export class MenuButtonComponent {

  constructor(
    private readonly nav: NavService
  ) {}

  @HostBinding('class.menu-button-open') menuButtonOpen=false

  toggleButton() {
    this.menuButtonOpen = !this.menuButtonOpen
  }

  buttons: MenuButtonItem[] = [{
    label: "Artists",
    onclick: () => this.nav.to('test')
  }, {
    label: "Artists",
    onclick: () => this.nav.to('test')
  }, {
    label: "Artists",
    onclick: () => this.nav.to('test')
  }, {
    label: "Artists",
    onclick: () => this.nav.to('test')
  }]

  

}
