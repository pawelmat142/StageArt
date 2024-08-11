import { Component, Renderer2, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DESKTOP } from './services/device';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NavService } from './services/nav/nav.service';
import { CourtineService } from './services/nav/courtine.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'book-agency';

  constructor(
    private renderer: Renderer2,
    private courtineService: CourtineService,
  ) {}

  ngOnInit() {
    if (DESKTOP) {
      this.renderer.addClass(document.body, 'desktop')
    }
  }

  courtine$ = this.courtineService.courtine$

}
