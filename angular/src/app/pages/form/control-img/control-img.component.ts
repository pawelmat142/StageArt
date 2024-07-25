import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-control-img',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './control-img.component.html',
  styleUrl: './control-img.component.scss'
})
export class ControlImgComponent {

  @Input() url?: string

  @Input() height: number = 35

}
