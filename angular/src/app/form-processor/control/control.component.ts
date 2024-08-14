import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectorComponent, SelectorItem } from '../../global/controls/selector/selector.component';
import { pFormControl } from '../form-processor.service';
import { Observable, of } from 'rxjs';
import { FormUtil } from '../../global/utils/form.util';
import { DateComponent } from '../../global/controls/date/date.component';
import { InputComponent } from '../../global/controls/input/input.component';
import { TextareaElementComponent } from '../../global/controls/textarea-element/textarea-element.component';
import { TextareaComponent } from '../../global/controls/textarea/textarea.component';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    TextareaComponent,
    TextareaElementComponent,
    DateComponent,
    SelectorComponent
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  templateUrl: './control.component.html',
})
export class ControlComponent {

  constructor(
  ) {}

  @Input() control!: pFormControl

  _formControlName?: string

  _selectorItems$: Observable<SelectorItem[]> = of([])

  _required = false

  ngOnChanges(changes: SimpleChanges): void {
    this._required = this.control?.validators?.includes(Validators.required) || false

    if (this.control.type === 'selector') {
      if (!this.control.selectorItems$) {
        throw new Error(`Missing selector items`)
      }
      this._selectorItems$ = this.control.selectorItems$
    }

    this._formControlName = FormUtil.toCamelCase(this.control?.name)

  }

}
