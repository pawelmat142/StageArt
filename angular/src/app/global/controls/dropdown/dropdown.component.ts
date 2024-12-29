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

  @Output() select = new EventEmitter<SelectorItem>()

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
  
  onChange = (val: SelectorItem) => {
    this.select.emit(val)
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
