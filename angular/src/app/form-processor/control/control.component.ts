import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../pages/controls/input/input.component';
import { TextareaComponent } from '../../pages/controls/textarea/textarea.component';
import { TextareaElementComponent } from '../../pages/controls/textarea-element/textarea-element.component';
import { DatesComponent } from '../../pages/controls/dates/dates.component';
import { SelectorComponent, SelectorItem } from '../../pages/controls/selector/selector.component';
import { pFormControl } from '../form-processor.service';
import { FormUtil } from '../../utils/form.util';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    TextareaComponent,
    TextareaElementComponent,
    DatesComponent,
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

  _selectorItems: SelectorItem[] = []

  _required = false
  ngOnInit(): void {
    
    this._required = this.control?.validators?.includes(Validators.required) || false

    if (this.control.type === 'selector') {
      if (!this.control.getSelectorItems) {
        throw new Error(`Missing selector items`)
      }
      this._selectorItems = this.control.getSelectorItems()
    }

    this._formControlName = FormUtil.toCamelCase(this.control?.name)
  }

}
