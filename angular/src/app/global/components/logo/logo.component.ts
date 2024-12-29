import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LogoComponent {

  @Input() showDrop = true

}
