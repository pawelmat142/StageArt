import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';
import { SelectorItem } from '../../interface';

// depracated
@Component({
  selector: 'app-selector-items',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
  ],
  templateUrl: './selector-items.component.html',
  styleUrl: './selector-items.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SelectorItemsComponent {

  constructor(

  ) {}

  @Input() items: SelectorItem[] = []
  @Input() chachedImg = false

  @Output()
  select = new EventEmitter<SelectorItem>()

  _select(item: SelectorItem, event: MouseEvent) {
    this.select.emit(item)
    event.stopPropagation()
    event.preventDefault()
  }

}
