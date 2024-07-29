import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './btn.component.html',
  styleUrl: './btn.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BtnComponent {

  @Output() click = new EventEmitter<Event>()

  @Input() label = 'Submit'
  @Input() type = 'submit'
  @Input() icon?: string

  @HostBinding('class.active')
  @Input() active = true

  
  _click($event: Event) {
    $event.preventDefault()
    $event.stopPropagation()
    this.click.emit($event)
  }

}
