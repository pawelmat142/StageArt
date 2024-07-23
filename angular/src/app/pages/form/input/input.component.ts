import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, Input, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

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
export class InputComponent implements ControlValueAccessor, AfterViewInit {

  constructor(
    private readonly renderer: Renderer2
  ) {}

  value: string = '';
  disabled: boolean = false;

  onChange = (value: string) => {};

  onTouched = () => {};

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

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  
  @Input() label!: string
  @Input() placeholder: string = '';

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
  }


}
