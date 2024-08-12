import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../pages/controls/input/input.component';
import { TextareaComponent } from '../../pages/controls/textarea/textarea.component';
import { TextareaElementComponent } from '../../pages/controls/textarea-element/textarea-element.component';
import { DateComponent } from '../../pages/controls/dates/date.component';
import { SelectorComponent, SelectorItem } from '../../pages/controls/selector/selector.component';
import { pFormControl } from '../form-processor.service';
import { FormUtil } from '../../utils/form.util';
import { Observable, of } from 'rxjs';

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
