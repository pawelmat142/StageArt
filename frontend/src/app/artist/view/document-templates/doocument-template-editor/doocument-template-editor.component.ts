import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PdfDataDto, PdfSection, PdfTemplate } from '../../../model/document-template.def';
import { $desktop } from '../../../../global/tools/media-query';
import { MockCardComponent } from '../../../../global/components/mock-card/mock-card.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconButtonComponent } from '../../../../global/components/icon-button/icon-button.component';
import { FormFieldComponent } from '../../../../global/controls/form-field/form-field.component';
import { AccordionModule } from 'primeng/accordion';
import { PdfSectionComponent } from '../../pdf-section/pdf-section.component';
import { Menu } from 'primeng/menu';
import { PdfDataService } from '../../../pdf-data.service';
import { DocumentService } from '../../../../global/document/document.service';
import { Dialog } from '../../../../global/nav/dialog.service';
import { CourtineService } from '../../../../global/nav/courtine.service';
import { filter, map, mergeMap, Observable, tap } from 'rxjs';
import { ArtistViewDto } from '../../../model/artist-view.dto';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MenuDropdownComponent } from '../../../../global/components/menu-dropdown/menu-dropdown.component';

@Component({
  selector: 'app-doocument-template-editor',
  standalone: true,
  imports: [
    CommonModule,
    MockCardComponent,
    FormsModule,
    ButtonModule,
    IconButtonComponent,
    FormFieldComponent,
    AccordionModule,
    PdfSectionComponent,
    InputTextModule,
    MenuDropdownComponent
  ],
  templateUrl: './doocument-template-editor.component.html',
  styleUrl: './doocument-template-editor.component.scss'
})
export class DoocumentTemplateEditorComponent {

  readonly $desktop = $desktop

    constructor(
      private readonly pdfDataservice: PdfDataService,
      private readonly documentService: DocumentService,
      private readonly dialog: Dialog,
      private readonly courtine: CourtineService,
    ) {}

    
  @Input() pdfData!: PdfDataDto
  @Input() artist!: ArtistViewDto

  @Output() update = new EventEmitter<PdfDataDto | undefined>()

  _closePdfData() {
    this.update.emit(undefined)
  }

  _reset(template: PdfTemplate) {
    this.dialog.yesOrNoPopup(`Reset to default, sure?`).subscribe(() => {
      setTimeout(() => {
        this._selectDefault(template)
      })
    })
  }

  _selectDefault(template: PdfTemplate) {
    this.pdfDataservice.getDefaultPdfData$(template)
      .subscribe(pdfData => {
        this.pdfData = pdfData
      })
  }

  
  _preview(pdfData: PdfDataDto) {
    const url = pdfData.id 
      ? `/pdf-data/preview/${pdfData.id}/${pdfData.template}`
      : `/pdf-data/preview-default/${pdfData.template}`
    const filename = `${pdfData.template.toLocaleLowerCase()}-preview`
    this.documentService.documentRequestFullUrl(url, undefined, filename)
  }

  _save() {
    const pdfData = this.pdfData
    this.dialog.yesOrNoPopup(`Save template, sure?`).pipe(
      tap(() => this.courtine.startCourtine()),
      mergeMap(() => this.checkIfTemplateWithNameExists(pdfData)),
      filter(exists => !exists),
      mergeMap(() => this.pdfDataservice.save$(this.artist.signature, pdfData)),
      map((pdfData) => this.update.emit(pdfData)),
      tap(() => this.courtine.stopCourtine()),
      map(() => this.update.emit(undefined)),
      tap(() => this.dialog.succesToast(`Saved`)),
    ).subscribe()
  }

  private checkIfTemplateWithNameExists(pdfData: PdfDataDto): Observable<boolean> {
    return this.pdfDataservice.getByName$(pdfData.name, this.artist.signature).pipe(
      map(existing => existing && existing?.id !== pdfData.id),
      tap(exists => {
        if (exists) {
          this.courtine.stopCourtine()
          this.dialog.warnToast(`Template with this name already exists`)
        }
      })
    )
  }

  _sectionMenuItems(sectionIndex: number): MenuItem[] {
    const defaultMenu: MenuItem[] = [{
      label: 'Remove section',
      command: (e:{ originalEvent: PointerEvent }) => {
        this._removeSection(sectionIndex)
      }
    }, {
      label: 'Add section above',
      command: (e:{ originalEvent: PointerEvent }) => {
        this._addSection(sectionIndex)
      }
    }]
    const pdfData = this.pdfData
    if (pdfData) {
      const section = pdfData.sections[sectionIndex]
      if (section?.editable) {
        if (section.header) {
          defaultMenu.unshift({
            label: `Remove section header`,
            command: (e:{ originalEvent: PointerEvent }) => {
              this._removeSectionHeader(section, pdfData)
            }
          })
        } else {
          defaultMenu.unshift({
            label: `Add section header`,
            command: (e:{ originalEvent: PointerEvent }) => {
              this._addSectionHeader(section, pdfData)
            }
          })
        }
      }
    }
    return defaultMenu;
  }

  _removeSection(i: number) {
    this.dialog.yesOrNoPopup(`Remove section ${i+1}, sure?`).subscribe(() => {
      const pdfData = this.pdfData
      if (pdfData) {
        pdfData.sections.splice(i, 1)
        this.pdfData = pdfData
      }
    })
  }

  _addSection(i: number) {
    const section: PdfSection = {
      items: [],
      show: true,
      editable: true
    }
    const pdfData = this.pdfData
    if (pdfData) {
      pdfData.sections.splice(i + 1, 0, section)
      this.pdfData = pdfData
    }
  }

  _removeSectionHeader(section: PdfSection, pdfData: PdfDataDto) {
    if (section) {
      section.header = undefined
    }
  }

  _addSectionHeader(section: PdfSection, pdfData: PdfDataDto) {
    if (section) {
      section.header = ''
    }
  }
}
