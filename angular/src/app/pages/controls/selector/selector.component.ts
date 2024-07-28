import { CommonModule } from '@angular/common';
import { Component, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ArtistMediaCode } from '../../../services/artist/artist-medias/artist-medias.service';
import { IconButtonComponent } from "../../components/icon-button/icon-button.component";
import { AbstractControlComponent } from '../abstract-control/abstract-control.component';


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
export class SelectorComponent extends AbstractControlComponent<SelectorItem> {

  public static get EMPTY_SELECTOR_ITEM() { return { code: '', name: '' } as SelectorItem }

  override ngOnInit(): void {
    super.ngOnInit()
    this.filterItems()
  }

  _onInput($event: Event) {
      const input = $event.target as HTMLInputElement;
      this.value = { name: input.value, code: '' }
      this.filterItems(input.value)

    this.value = { name: input.value, code: '' }
    this.filterItems(input.value)
  }

  @Input() items!: SelectorItem[]
  _items: SelectorItem[] = []
  @Input() itemsLength = 10
    

  _select(item: SelectorItem, event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    this.updateValue(item)
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