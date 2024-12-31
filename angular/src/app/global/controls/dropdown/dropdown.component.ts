import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectorItem } from '../../interface';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    IconButtonComponent
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {

  @Input() items: SelectorItem[] = []
  @Input() optionLabel = 'name'
  @Input() placeholder = 'Select...'

  @Output() select = new EventEmitter<SelectorItem | null>()

  private _value: SelectorItem | null = null

  get value() {
    return this._value;
  }
  
  set value(valueFromNgModel: any) {
    this.writeValue(valueFromNgModel);
  }

  writeValue(value: SelectorItem | null): void {
    this._value = value || null;
    setTimeout(() => {
      this.onChange(this._value);
    })
    this.select.emit(this._value);
  }

  onChange = (val: SelectorItem| null) => {
  }
  onTouched = () => {}

  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
  }

}
