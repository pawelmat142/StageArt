import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-textarea-element',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './textarea-element.component.html',
  styleUrl: './textarea-element.component.scss'
})
export class TextareaElementComponent {

  @Output() onInput = new EventEmitter<Event>()

  @Input() value: string = ''

  @Input() disabled? = false
  @Input() placeholder? = ''

  _rows = 4

  ngOnInit(): void {
    this.calculateRowsNumber()
  }

  _onInput($event: Event) {
    this.onInput.emit($event)
    this.resize()
  }

  private resize() {
    this.calculateRowsNumber()
    }

  private calculateRowsNumber() {
    this._rows = this.value.split('\n').length
    if (this._rows < 3) {
      this._rows = 3
    }
  }

}
