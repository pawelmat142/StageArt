import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectorItem } from '../../interface';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DropdownModule
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

  private _value?: SelectorItem

  get value() {
    return this._value;
  }
  
  set value(val: any) {
    this._value = val;
    this.onChange(val);
  }

  writeValue(value: SelectorItem): void {
    this.value = value
  }
  
  onChange = (val: SelectorItem) => {}
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
