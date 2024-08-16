import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, HostListener, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ArtistMediaCode } from '../../../artist/artist-medias/artist-medias.service';
import { AbstractControlComponent } from '../abstract-control/abstract-control.component';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';
import { SelectorItemsComponent } from './selector-items/selector-items.component';

export interface SelectorItem {
  code: string
  name: string
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
    SelectorItemsComponent
],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true
    }
  ]
})
export class SelectorComponent extends AbstractControlComponent<string> {

  _displayValue: string = ''

  override ngOnInit(): void {
    super.ngOnInit()
    if (this.value) {
      this._item = this.items.find(i => i.code === this.value) || null
    }
    this.filterItems()
  }

  _onInput($event: Event) {
    const input = $event.target as HTMLInputElement;
    this.value = input.value
    this.filterItems(input.value)
    if (this.allowWriteItem) {
      this.updateValue(this.value)
    }
  }

  @Input() items!: SelectorItem[]
  _items: SelectorItem[] = []
  @Input() itemsLength = 10
  @Input() chachedImg = false
  @Input() allowWriteItem = false

  _item: SelectorItem | null = null

  @Output() select = new EventEmitter<SelectorItem>()

  @Input() selectCode?: string

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectCode']) {
      const item = this.items.find(i => i.code === this.selectCode)
      if (item) {
        this._select(item)
      }
    }
    if (changes['items']) {
      this.filterItems()
    }
  }

  _select(item: SelectorItem) {
    this._item = item
    this.updateValue(item.code)
    this._displayValue = item.name
    this.select.emit(item)
    this.onBlur()
  }

  private filterItems(inputString?: string) {
    if (inputString) {
      this._items = this.items.filter(i => i.name.toLocaleLowerCase().startsWith(inputString.toLocaleLowerCase()))
    } else {
      this._items = this.items
    }
  }

  override onblur = ($event: FocusEvent) => {
    if (this.active) {
      $event.preventDefault()
      $event.stopPropagation()
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutOfComponent(targetElement: HTMLElement): void {
    if (this.active) {
      if (!this.elementRef.nativeElement.contains(targetElement)) {
        this.active = false
        this.elementRef.nativeElement.blur()
      }
    }
  }

}