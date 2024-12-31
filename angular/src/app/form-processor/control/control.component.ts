import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { pFormControl } from '../form-processor.service';
import { Observable, of } from 'rxjs';
import { FormUtil } from '../../global/utils/form.util';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownComponent } from '../../global/controls/dropdown/dropdown.component';
import { FormFieldComponent } from '../../global/controls/form-field/form-field.component';
import { SelectorItem } from '../../global/interface';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,

    InputTextModule,
    CalendarModule,
    DropdownComponent,
    FormFieldComponent,
    InputTextareaModule
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

  @HostBinding('class.double-size') doubleSize = false 

  _formControlName?: string

  _selectorItems$: Observable<SelectorItem[]> = of([])

  _required = false

  _label = ''

  ngOnChanges(changes: SimpleChanges): void {
    this._required = this.control?.validators?.includes(Validators.required) || false
    this._label = this.control.name
    if (this._required) {
      this._label = `*${this._label}`
    }
    if (this.control.type === 'selector') {
      if (!this.control.selectorItems$) {
        throw new Error(`Missing selector items`)
      }
      this._selectorItems$ = this.control.selectorItems$
    }

    this._formControlName = FormUtil.toCamelCase(this.control?.name)

    this.doubleSize = this.control?.type === 'textarea'
  }

}
