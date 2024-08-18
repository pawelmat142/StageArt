import { Component, ElementRef, HostBinding, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavService } from '../../nav/nav.service';
import { BtnComponent } from '../../controls/btn/btn.component';
import { MenuService } from '../../nav/menu-service';

@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [
    CommonModule,
    BtnComponent,
],
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MenuButtonComponent {

  constructor(
    private readonly nav: NavService,
    readonly menu: MenuService,
  ) {}

  @HostBinding('class.menu-button-open') menuButtonOpen = false

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
}
