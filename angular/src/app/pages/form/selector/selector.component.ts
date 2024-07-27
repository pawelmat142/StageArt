import { CommonModule } from '@angular/common';
import { Component, ElementRef, forwardRef, HostBinding, HostListener, Injector, Input, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { ArtistMediaCode } from '../../../services/artist-medias/artist-medias.service';
import { IconButtonComponent } from "../../components/icon-button/icon-button.component";


export interface SelectorItem {
  code: string
  label: string
  imgUrl?: string
  svg?: ArtistMediaCode
}


@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconButtonComponent,
],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true
    }
  ]
})
export class SelectorComponent implements ControlValueAccessor {

  private _EMPTY_VALUE = { code: '', label: '' } as SelectorItem

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private injector: Injector
  ) {
    this.value = this._EMPTY_VALUE
  }

  value: SelectorItem = this._EMPTY_VALUE;
  disabled: boolean = false;

  onChange = (value: SelectorItem) => {}

  onTouched = () => {}

  onInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      this.value = { label: input.value, code: '' }
      this.filterItems(input.value)
      this.onChange(this.value)
  }

  writeValue(value: SelectorItem): void {
    this.value = value;
    this.onChange(value)
  }
  
  registerOnChange(fn: (value: SelectorItem) => void): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  @Input() items!: SelectorItem[]
  _items: SelectorItem[] = []
  
  @Input() itemsLength = 10
  
  @Input() label!: string
  _label: string = '';
  
  @Input() required: boolean = false
  @Input() placeholder: string = '';
  
  private ngControl?: NgControl

  ngOnInit(): void {
    this._label = this.required ? `*${this.label}` : this.label
    this.ngControl = this.injector?.get(NgControl);

    this.value = this._EMPTY_VALUE
    this.filterItems()
  }
  
  private filterItems(inputString?: string) {
    if (inputString) {
      this._items = this.items.filter(i => i.label.toLocaleLowerCase().startsWith(inputString.toLocaleLowerCase()))
    } else {
      this._items = this.items
    }
  }
  
  
  @ViewChild('formSelector') formSelector?: ElementRef<HTMLElement>;
  @ViewChild('selectorControl') selectorControl?: ElementRef<HTMLInputElement>;
  
  private showItems = false
  
  ngAfterViewInit(): void {
    this.formSelector!.nativeElement.onclick = () => {
      if (!this.showItems) {
        this.selectorControl?.nativeElement.focus()
      }
    }
    this.selectorControl!.nativeElement.onfocus = () => {
      this.show()
    }
    this.selectorControl!.nativeElement.onblur = () => {
      this.onTouched()
    }
  }
  
  @HostListener('document:keydown', ['$event']) 
  onKeydown(event: KeyboardEvent) {
    if (this.showItems) {
      if (event.code === 'Escape') {
        this.writeValue(this._EMPTY_VALUE)
        this.hide()
        this.selectorControl?.nativeElement.blur()
      }
    }
  }
  
  @HostListener('document:click', ['$event.target'])
  onClickOutOfComponent(targetElement: HTMLElement): void {
    if (this.showItems) {
      if (!this.elementRef.nativeElement.contains(targetElement)) {
        this.writeValue(this.prepareItem(this.selectorControl?.nativeElement.value))
        this.hide()
      }
    }
  }
  
  private show() {
    if (!this.showItems && this.formSelector) {
      this.renderer.addClass(this.formSelector.nativeElement, 'show-items')
      this.showItems = true
      // this.onTouched()
    }
  }
  
  private hide() {
    if (this.showItems && this.formSelector) {
      this.renderer.removeClass(this.formSelector.nativeElement, 'show-items')
      this.showItems = false
    }
  }

  private prepareItem(value: string = ''): SelectorItem {
    return {
      label: value,
      code: value
    }
  }
  
  _select(item: SelectorItem, event: MouseEvent) {
    event.stopPropagation()
    this.hide()
    this.writeValue(item)
  }

}

