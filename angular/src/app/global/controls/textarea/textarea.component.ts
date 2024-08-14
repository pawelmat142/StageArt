import { Component, forwardRef } from '@angular/core';
import { AbstractControlComponent } from '../../../global/controls/abstract-control/abstract-control.component';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextareaElementComponent } from '../textarea-element/textarea-element.component';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [
    CommonModule,
    TextareaElementComponent,
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent ),
      multi: true
    }
  ]
})
export class TextareaComponent extends AbstractControlComponent<string> {

  override get _EMPTY_VALUE(): string { return '' }

  _onInput($event: Event) {
    const input = $event.target as HTMLInputElement;
    this.updateValue(input.value)
  }

}
