import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, Injector, Input, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';

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
export class InputComponent implements ControlValueAccessor {

  constructor(
    private readonly renderer: Renderer2,
    private injector: Injector
  ) {}

  value: string = '';
  disabled: boolean = false;

  onChange = (value: string) => {}

  onTouched = () => {};
  
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  @Input() label!: string
  _label: string = '';

  @Input() required: boolean = false
  @Input() placeholder: string = '';

  private ngControl?: NgControl


  ngOnInit(): void {
    this._label = this.required ? `*${this.label}` : this.label
    this.ngControl = this.injector.get(NgControl);
  }
  
  
  @ViewChild('formInput') formInput!: ElementRef<HTMLInputElement>;
  @ViewChild('inputControl') inputControl!: ElementRef<HTMLInputElement>;


  ngAfterViewInit(): void {
    this.inputControl.nativeElement.onfocus = () => {
      this.renderer.addClass(this.formInput.nativeElement, 'active')
    }
    this.inputControl.nativeElement.onblur = () => {
      this.renderer.removeClass(this.formInput.nativeElement, 'active')
    }
    this.formInput.nativeElement.onclick = () => {
      this.renderer.selectRootElement(this.inputControl.nativeElement).focus()
    }
    this.formInput.nativeElement.onblur = () => {
      this.onTouched()
    }
  }

}
