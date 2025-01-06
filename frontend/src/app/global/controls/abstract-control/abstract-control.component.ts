import { Component, ElementRef, HostBinding, HostListener, Injector, Input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  template: '',
})
export abstract class AbstractControlComponent<T> implements ControlValueAccessor {

  constructor (
    protected elementRef: ElementRef,
    private injector: Injector
  ) {}


  // OVERRIDE!!
  protected get _EMPTY_VALUE(): T { return null as T }

  protected value: T = this._EMPTY_VALUE;

  disabled: boolean = false;

  onChange = (value: T) => {}
  onTouched = () => {}

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement this if needed
  }

  protected updateValue(value: T): void {
    this.value = value
    this.onChange(value)
  }

  protected input?: HTMLInputElement | HTMLTextAreaElement
  protected ngControl?: NgControl

  @HostBinding('class.active') protected active = false

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.onclick = this.onclick
    this.findInput()
  }

  protected onclick = ($event: MouseEvent) => {
    this.input!.focus()
  }

  protected onfocus = ($event: FocusEvent) => {
    this.active = true
  }

  protected onblur = ($event: FocusEvent) => {
    this.onTouched()
    this.active = false
  }


  private findInput() {
    const input = this.elementRef.nativeElement.querySelector('textarea, input')
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
      this.input = input
    }
    if (!this.input) {
        throw new Error('Input not found')
    }
    this.input!.onfocus = this.onfocus
    this.input!.onblur = this.onblur
  }

  protected onBlur() {
    this.active = false
  }

  protected get selected(): boolean {
    return true
  }


  @HostListener('document:keydown', ['$event']) 
  onKeydown(event: KeyboardEvent) {
    if (this.selected) {
      if (event.code === 'Escape') {
        this.input?.blur()
        this.updateValue(this._EMPTY_VALUE)
      }
    }
  }


  ngOnInit(): void {
    this.value = this._EMPTY_VALUE
    this._label = this.required ? `${this.label} *` : this.label
  }

  @Input() label!: string
  _label: string = '';
  
  @Input() required: boolean = false
  @Input() placeholder: string = '';

}
