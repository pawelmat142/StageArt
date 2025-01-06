import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  encapsulation: ViewEncapsulation.None
})
export class IconComponent {

  @Input() icon!: string
  @Input() size = 16

}
