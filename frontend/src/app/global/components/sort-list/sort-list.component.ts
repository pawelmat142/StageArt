import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, PipeTransform } from '@angular/core';
import { SortItemPipe } from './sort-item.pipe';
import { $desktop } from '../../tools/media-query';
import { Util } from '../../utils/util';
import { IconComponent } from '../icon/icon.component';

export interface SortLabel {
  name: string
  itemPath: string
  type: 'string' | 'number' | 'date'
  itemPipe?: PipeTransform,
  itemPipeArgs?: any[],
  size?: 1 | 2 | 3 | 4 | 5 | 6
  class?: string,
  showDesktop?: boolean

  sort?: boolean
  reverse?: boolean
  changeOnClick?: boolean,
  order?: string[]
}

@Component({
  selector: 'app-sort-list',
  standalone: true,
  imports: [
    CommonModule,
    SortItemPipe,
    IconComponent
  ],
  providers: [
    DatePipe,
  ],
  templateUrl: './sort-list.component.html',
  styleUrl: './sort-list.component.scss'
})
export class SortListComponent<T> {

  @Input() items: T[] = []

  @Input() labels: SortLabel[] = []

  @Input() itemsClickable?: boolean = false

  @Output() itemClick = new EventEmitter<number>()

  gridTemplateColumns = '1fr'

  _items: T[] = []

  _selectedSortOption?: SortLabel

  ngOnInit(): void {
    this._selectedSortOption = this.labels.filter(l => l.sort)[0]

    this.gridTemplateColumns = this.labels
      .filter(label =>  $desktop || !label.showDesktop)
      .map(label => label.size ? `${label.size}fr` : `1fr`).join(' ')

    this.sort()
  }

  _selectSortOption(sortLabel: SortLabel) {
    if (!sortLabel.changeOnClick) {
      return
    }
    if (sortLabel === this._selectedSortOption) {
      sortLabel.reverse = !sortLabel.reverse
    } else {
      this._selectedSortOption = sortLabel
    }
    this.sort()
  }

  private sort() {
    this._items = JSON.parse(JSON.stringify(this.items))

    if (!this._selectedSortOption) {
      return
    }

    const type = this._selectedSortOption.type

    if (type === 'date') {
      this._items = this._items.sort((a, b) => {
        const aVal = new Date(Util.get(a, this._selectedSortOption!.itemPath)).getTime()
        const bVal = new Date(Util.get(b, this._selectedSortOption!.itemPath)).getTime()
        return this._selectedSortOption?.reverse ? bVal - aVal : aVal - bVal
      })
    } else if (this._selectedSortOption.order) {
      this._items = this._items.sort((a, b) => {
        const aVal = this._selectedSortOption!.order!.indexOf(Util.get(a, this._selectedSortOption!.itemPath))
        const bVal = this._selectedSortOption!.order!.indexOf(Util.get(b, this._selectedSortOption!.itemPath))
        return this._selectedSortOption?.reverse ? bVal - aVal : aVal - bVal
      })
    } else if (type === 'string') {
      this._items = this._items.sort((a, b) => {
        const aVal = Util.get(a, this._selectedSortOption!.itemPath) as string
        const bVal = Util.get(b, this._selectedSortOption!.itemPath) as string
        return this._selectedSortOption?.reverse ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
      })
    } else {
      this._items = this._items.sort((a, b) => {
        const aVal = Number(Util.get(a, this._selectedSortOption!.itemPath))
        const bVal = Number(Util.get(b, this._selectedSortOption!.itemPath))
        return this._selectedSortOption?.reverse ? bVal - aVal : aVal - bVal
      })
    }

  }
}
