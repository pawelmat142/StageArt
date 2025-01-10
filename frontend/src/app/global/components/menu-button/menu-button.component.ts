import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../nav/nav.service';
import { MenuService } from '../../nav/menu-service';
import { ButtonModule } from 'primeng/button';
import { OutClickDirective } from '../../directives/out-click.directive';

@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    OutClickDirective
],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss',
})
export class MenuButtonComponent {

  constructor(
    private readonly nav: NavService,
    readonly menu: MenuService,
  ) {}

  menuButtonOpen = false

  @ViewChild('menuButtonRef') menuButtonRef?: ElementRef

  private menuButtonOverhiddenBefore = false
  
  @HostListener('window:scroll', ['$event'])
  isMenuButtonOverhidden() {
    const rect = this.menuButtonRef?.nativeElement.getBoundingClientRect()
    const menuButtonOverhidden = rect.bottom < 0
    if (this.menuButtonOverhiddenBefore !== menuButtonOverhidden) {
      this.nav.menuButtonOverhidden = menuButtonOverhidden
      this.menuButtonOverhiddenBefore = menuButtonOverhidden
    }
  }

  toggleButton() {
    this.menuButtonOpen = !this.menuButtonOpen
  }

  close() {
    this.menuButtonOpen = false
  }
}
