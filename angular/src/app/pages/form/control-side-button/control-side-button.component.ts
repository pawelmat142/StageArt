import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-control-side-button',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './control-side-button.component.html',
  styleUrl: './control-side-button.component.scss'
})
export class ControlSideButtonComponent {

  @Input() active = true
  @Input() show = true
  @Input() icon?: string
  @Input() size = 40
  @Input() color = 'red'

  @Output() click = new EventEmitter<void>()

  _click(event: MouseEvent) {
    this.click.emit()
    event.preventDefault()
    event.stopPropagation()
  }
}
