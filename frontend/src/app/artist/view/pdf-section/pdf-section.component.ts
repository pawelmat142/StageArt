import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PdfSection, PdfSectionItem } from '../../model/document-template.def';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from '../../../global/nav/dialog.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { IconButtonComponent } from '../../../global/components/icon-button/icon-button.component';
import { AccordionModule } from 'primeng/accordion';
import { MenuDropdownComponent } from '../../../global/components/menu-dropdown/menu-dropdown.component';

@Component({
  selector: 'app-pdf-section',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule,
    ButtonModule,
    IconButtonComponent,
    AccordionModule,
    MenuDropdownComponent
  ],
  templateUrl: './pdf-section.component.html',
  styleUrl: './pdf-section.component.scss'
})
export class PdfSectionComponent {

  constructor(
    private readonly dialog: Dialog,
  ) {}

  @Input() section!: PdfSection 
  @Input() index!: number 
  @Input() subsection = false

  @Output() updateSection = new EventEmitter<PdfSection | null>()


  _removeItem(itemIndex: number) {
    const item = this.section.items[itemIndex]
    if (item) {
      this.dialog.yesOrNoPopup(`Remove item, sure?`).subscribe(() => {
        this.section.items.splice(itemIndex, 1)
        this.updateSection.emit(this.section)
      })
    }
  }

  _removeListItem(itemIndex: number, listItemIndex: number) {
    const item = this.section.items[itemIndex]
    if (item) {
      const list = item.list
      if (list) {
        const listItem = list[listItemIndex];
        if (listItem) {
          this.dialog.yesOrNoPopup(`Remove list item, sure?`).subscribe(() => {
            list.splice(listItemIndex, 1)
            this.updateSection.emit(this.section)
          })
        }
      }
    }
  }

  _addListItem(itemIndex: number) {
    const item = this.section.items[itemIndex]
    if (item) {
      if (!item.list) {
        item.list = []
      }
      item.list.push('')
      this.updateSection.emit(this.section)
    }
  }

  _sectionItemMenu(itemIndex: number, item?: PdfSectionItem): MenuItem[] {
    const itemName = item?.paragraph ? 'paragraph' 
     : item?.list ? 'list' 
     : item?.break ? 'break' 
     : 'item' 
    const defaultItmems = [{
      label: `Remove ${itemName}`,
      command: (e:{ originalEvent: PointerEvent }) => {
        this._removeItem(itemIndex)
      },
    }, {
      label: `Add paragrapgh`,
      command: (e:{ originalEvent: PointerEvent }) => {
        const item: PdfSectionItem = { paragraph: '', editable: true }
        this.section.items.splice(itemIndex+1, 0, item)
        this.updateSection.emit(this.section)
      }
    }, {
      label: `Add list`,
      command: (e:{ originalEvent: PointerEvent }) => {
        const item: PdfSectionItem = { list: [''], editable: true  }
        this.section.items.splice(itemIndex+1, 0, item)
        this.updateSection.emit(this.section)
      }
    }, {
      label: `Add break`,
      command: (e:{ originalEvent: PointerEvent }) => {
        e.originalEvent.stopPropagation()
        const item: PdfSectionItem = { break: true, editable: true }
        this.section.items.splice(itemIndex+1, 0, item)
        this.updateSection.emit(this.section)
      }
    }, {
      label: `Add subsection`
      // TODO
    }]
    if (item?.list) {
      defaultItmems.unshift({
        label: `Add list item`,
        command: (e:{ originalEvent: PointerEvent }) => {
          const item = this.section.items[itemIndex]
          if (item.list) {
            item.list.push('')
            this.updateSection.emit(this.section)
          }
        }
      })
    }

    return defaultItmems
  }

  trackByIndex(index: number): number {
    return index; // Use the index as the unique identifier
  }

}
