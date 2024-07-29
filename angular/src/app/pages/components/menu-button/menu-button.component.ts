import { Component, ElementRef, HostBinding, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuButtonItem, NavService } from '../../../services/nav.service';
import { CommonModule } from '@angular/common';
import { BtnComponent } from '../../controls/btn/btn.component';


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
    private readonly nav: NavService
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

  buttons: MenuButtonItem[] = []

  ngOnInit() {
    this.buttons = this.nav.menuButtons
  }

  toggleButton() {
    this.menuButtonOpen = !this.menuButtonOpen
  }
}
