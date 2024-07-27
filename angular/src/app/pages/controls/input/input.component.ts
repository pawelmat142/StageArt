import { CommonModule } from '@angular/common';
import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { AbstractControlComponent } from '../abstract-control/abstract-control.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent extends AbstractControlComponent<string> {

  override get _EMPTY_VALUE(): string { return '' }

  _onInput($event: Event) {
    const input = $event.target as HTMLInputElement;
    this.updateValue(input.value)
  }

}
