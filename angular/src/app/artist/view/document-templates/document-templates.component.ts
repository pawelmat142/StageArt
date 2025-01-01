import { Component, Input, OnInit } from '@angular/core';
import { ArtistViewDto } from '../../model/artist-view.dto';
import { PdfDataService } from '../../pdf-data.service';
import { PdfDataDto, PdfSection, PdfTemplate, PdfTemplateConst } from '../../model/document-template.def';
import { BehaviorSubject, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '../../../global/components/icon-button/icon-button.component';
import { ButtonModule } from 'primeng/button';
import { FormFieldComponent } from '../../../global/controls/form-field/form-field.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Dialog } from '../../../global/nav/dialog.service';
import { PdfSectionComponent } from '../pdf-section/pdf-section.component';
import { AccordionModule } from 'primeng/accordion';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';


type PdfDatasPerTemplate = { 
  template: PdfTemplate, 
  pdfDatas: PdfDataDto[]
}

@Component({
  selector: 'app-document-templates',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    IconButtonComponent,
    FormFieldComponent,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule,
    PdfSectionComponent,
    AccordionModule,
    MenuModule,
  ],
  templateUrl: './document-templates.component.html',
  styleUrl: './document-templates.component.scss'
})
export class DocumentTemplatesComponent implements OnInit {

  constructor(
    private readonly documentTemplatesService: PdfDataService,
    private readonly dialog: Dialog,
  ) {}

  @Input() artist!: ArtistViewDto

  pdfDatasPerTemplate$ = new BehaviorSubject<PdfDatasPerTemplate[]>([])

  pdfData$ = new BehaviorSubject<PdfDataDto | undefined>(undefined)

  ngOnInit(): void {
    this.loadTemplates()
  }

  loadTemplates() {
    this.documentTemplatesService
    .getDocumentTemplates$()
    .subscribe(documentTemplates => {
      const pdfDatasPerTemplate: PdfDatasPerTemplate[] = PdfTemplateConst.map((template: PdfTemplate) => {
        const pdfDatas: PdfDataDto[] = documentTemplates.filter(t => t.template === template)
        return {
          template,
          pdfDatas
        }
      })
      this.pdfDatasPerTemplate$.next(pdfDatasPerTemplate)
    })
  }

  _selectDefault(template: PdfTemplate) {
    this.documentTemplatesService.getDefaultPdfData$(template)
    .pipe(tap(console.log))
    .subscribe(pdfData => this.pdfData$.next(pdfData))
  }

  _closePdfData() {
    this.pdfData$.next(undefined)
  }

  _reset(template: PdfTemplate) {
    this.dialog.yesOrNoPopup(`Reset to default, sure?`).pipe(
    ).subscribe((confirmed) => {
      if (confirmed) {
        this._closePdfData()
        setTimeout(() => {
          this._selectDefault(template)
        })
      }
    })
  }

  _save() {
    console.log('TODO!')
  }

  _removeSection(i: number) {
    this.dialog.yesOrNoPopup(`Remove section ${i+1}, sure?`).pipe(
    ).subscribe((confirmed) => {
      if (confirmed) {
        const pdfData = this.pdfData$.value
        if (pdfData) {
          pdfData.sections.splice(i, 1)
          this.pdfData$.next(pdfData)
        }
      }
    })

  }

  _addSection(i: number) {
    const section: PdfSection = {
      items: [],
      show: true,
      editable: true
    }
    const pdfData = this.pdfData$.value
    if (pdfData) {
      pdfData.sections.splice(i + 1, 0, section)
      this.pdfData$.next(pdfData)
    }
  }

  _removeItem(i: number, itemIndex: number) {
    const pdfData = this.pdfData$.value
    if (pdfData) {
      const section = pdfData.sections[i]
      if (section) {
        const item = section.items[itemIndex]
        if (item) {
          this.dialog.yesOrNoPopup(`Remove item, sure?`).pipe(
          ).subscribe((confirmed) => {
            if (confirmed) {
              section.items.splice(itemIndex, 1)
              this.pdfData$.next(pdfData)
            }
          })
        }
      }
    }
  }

  _removeListItem(i: number, itemIndex: number, listItemIndex: number) {
    const pdfData = this.pdfData$.value
    if (pdfData) {
      const section = pdfData.sections[i]
      if (section) {
        const item = section.items[itemIndex]
        if (item) {
          const listItem = item.list?.[listItemIndex];
          if (listItem) {
            this.dialog.yesOrNoPopup(`Remove list item, sure?`).pipe(
            ).subscribe((confirmed) => {
              if (confirmed) {
                item.list?.splice(listItemIndex, 1)
                this.pdfData$.next(pdfData)
              }
            })
          }
        }
      }
    }
  }

  _addListItem(i: number, itemIndex: number) {
    const pdfData = this.pdfData$.value
    if (pdfData) {
      const section = pdfData.sections[i]
      if (section) {
        const item = section.items[itemIndex]
        if (item) {
          item.list = item.list || []
          item.list.push('')
          this.pdfData$.next(pdfData)
        }
      }
    }

  }

  trackByIndex(index: number): number {
    return index; // Use the index as the unique identifier
  }

  _sectionMenuItems(menu: Menu, sectionIndex: number): MenuItem[] {
    const defaultMenu: MenuItem[] = [{
      label: 'Remove section',
      command: (e:{ originalEvent: PointerEvent }) => {
        e.originalEvent.stopPropagation()
        this._removeSection(sectionIndex)
      }
    }, {
      label: 'Add section above',
      command: (e:{ originalEvent: PointerEvent }) => {
        e.originalEvent.stopPropagation()
        this._addSection(sectionIndex)
      }
    }, {
      label: 'Close',
      command: (e:{ originalEvent: PointerEvent }) => {
        e.originalEvent.stopPropagation()
        menu.toggle(e.originalEvent)
      }
    }]
    const pdfData = this.pdfData$.value
    if (pdfData) {
      const section = pdfData.sections[sectionIndex]
      if (section?.editable) {
        if (section.header) {
          defaultMenu.unshift({
            label: `Remove section header`,
            command: (e:{ originalEvent: PointerEvent }) => {
              e.originalEvent.stopPropagation()
              this._removeSectionHeader(section, pdfData)
            }
          })
        } else {
          defaultMenu.unshift({
            label: `Add section header`,
            command: (e:{ originalEvent: PointerEvent }) => {
              e.originalEvent.stopPropagation()
              this._addSectionHeader(section, pdfData)
            }
          })
        }
      }
    }
    return defaultMenu;
  }

  _removeSectionHeader(section: PdfSection, pdfData: PdfDataDto) {
    if (section) {
      section.header = undefined
      this.pdfData$.next(pdfData)
    }
  }

  _addSectionHeader(section: PdfSection, pdfData: PdfDataDto) {
    if (section) {
      section.header = ''
      this.pdfData$.next(pdfData)
    }
  }

  _toggleSectionMenu(menu: Menu, event: Event) {
    event.stopPropagation()
    menu?.toggle(event)
  }


}
