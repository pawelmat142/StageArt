import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-dropdown',
  standalone: true,
  imports: [
    IconButtonComponent,
    MenuModule
  ],
  templateUrl: './menu-dropdown.component.html',
  styleUrl: './menu-dropdown.component.scss'
})
export class MenuDropdownComponent {

  
  @Input() items: MenuItem[] = []
  
  @ViewChild('menuRef') menuRef?: Menu

  @ViewChild('menuDropdown') menuDropdownRef?: ElementRef
  

  _toggle(event: Event) {
    this.menuRef?.toggle(event)
  }

}
