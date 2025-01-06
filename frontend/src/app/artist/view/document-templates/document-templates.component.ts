import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ArtistViewDto } from '../../model/artist-view.dto';
import { PdfDataService } from '../../pdf-data.service';
import { PdfDataDto, PdfTemplate, PdfTemplateConst } from '../../model/document-template.def';
import { BehaviorSubject, map, mergeMap, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '../../../global/components/icon-button/icon-button.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Dialog } from '../../../global/nav/dialog.service';
import { AccordionModule } from 'primeng/accordion';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CourtineService } from '../../../global/nav/courtine.service';
import { DocumentService } from '../../../global/document/document.service';
import { $desktop } from '../../../global/tools/media-query';

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
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextareaModule,
    AccordionModule,
    MenuModule,
  ],
  templateUrl: './document-templates.component.html',
  styleUrl: './document-templates.component.scss'
})
export class DocumentTemplatesComponent implements OnChanges {

  readonly $desktop = $desktop

  constructor(
    private readonly pdfDataservice: PdfDataService,
    private readonly documentService: DocumentService,
    private readonly dialog: Dialog,
    private readonly courtine: CourtineService,
  ) {}

  @Input() artist!: ArtistViewDto

  pdfDatasPerTemplate$ = new BehaviorSubject<PdfDatasPerTemplate[]>([])

  @Output() pdfData = new EventEmitter<PdfDataDto | undefined>()

  pdfData$ = new BehaviorSubject<PdfDataDto | undefined>(undefined)

  ngOnChanges(): void {
    this.loadTemplates$().subscribe()
  }

  loadTemplates$(): Observable<void> {
    this.courtine.startCourtine()
    return this.pdfDataservice
      .list$(this.artist.signature)
      .pipe(
        map(documentTemplates => {
          const pdfDatasPerTemplate: PdfDatasPerTemplate[] = PdfTemplateConst.map((template: PdfTemplate) => {
            const pdfDatas: PdfDataDto[] = documentTemplates.filter(t => t.template === template)
            this.sortFirstActiveAfterByModified(pdfDatas)
            return {
              template,
              pdfDatas
            }
          })
          this.pdfDatasPerTemplate$.next(pdfDatasPerTemplate)
        }),
        tap(() => this.courtine.stopCourtine())
      )
  }

  _pdfDataMenuItems(menu: Menu, pdfData: PdfDataDto): MenuItem[] {
    const result: MenuItem[] = [{
      label: 'Generate preview',
      command: (e:{ originalEvent: PointerEvent }) => {
        e.originalEvent.stopPropagation()
        this._preview(pdfData)
      }
    }, {
      label: 'Open editor',
      command: (e:{ originalEvent: PointerEvent }) => {
        e.originalEvent.stopPropagation()
        this._selectPdfData(pdfData)
      }
    }, {
      label: 'Copy template',
      command: (e:{ originalEvent: PointerEvent }) => {
        e.originalEvent.stopPropagation()
        this.pdfDataservice.getByName$(pdfData.name, this.artist.signature).subscribe(copy => {
          if (copy) {
            copy.active = false
            copy.created = new Date()
            copy.modified = new Date()
            copy.id = ''
            copy.name = `${copy.name} - copy`
            this.pdfData$.next(copy)
          }
        })
      }
    }, {
      label: 'Delete',
      command: (e:{ originalEvent: PointerEvent }) => {
        e.originalEvent.stopPropagation()
        this.dialog.yesOrNoPopup(`Delete template, sure?`).pipe(
          tap(() => this.courtine.startCourtine()),
          mergeMap(() => this.pdfDataservice.delete$(pdfData.id)),
          mergeMap(() => this.loadTemplates$()),
          tap(() => this.courtine.stopCourtine()),
          tap(() => this.pdfData$.next(undefined)),
        ).subscribe()
      }
    }, {
      label: 'Close',
      command: (e:{ originalEvent: PointerEvent }) => {
        e.originalEvent.stopPropagation()
        menu.toggle(e.originalEvent)
      }
    }]
    if (!pdfData.active) {
      result.unshift({
        label: 'Activate',
        command: (e:{ originalEvent: PointerEvent }) => {
          e.originalEvent.stopPropagation()
          this.dialog.yesOrNoPopup(`Template will be activated, sure?`).pipe(
            tap(() => this.courtine.startCourtine()),
            mergeMap(() => this.pdfDataservice.activate$(pdfData.id, pdfData.template)),
            mergeMap(() => this.loadTemplates$()),
            tap(() => this.courtine.stopCourtine()),
          ).subscribe()
        }
      })
    } else {
      result.unshift({
        label: 'Deactivate',
        command: (e:{ originalEvent: PointerEvent }) => {
          e.originalEvent.stopPropagation()
          this.dialog.yesOrNoPopup(`Template will be deactivated, sure?`).pipe(
            tap(() => this.courtine.startCourtine()),
            mergeMap(() => this.pdfDataservice.deactivate$(pdfData.id, pdfData.template)),
            mergeMap(() => this.loadTemplates$()),
            tap(() => this.courtine.stopCourtine()),
          ).subscribe()
        }
      })
    }
    return result
  }

  _selectDefault(template: PdfTemplate) {
    this.pdfDataservice.getDefaultPdfData$(template)
      .subscribe(pdfData => this.pdfData.emit(pdfData))
  }

  _selectPdfData(pdfData: PdfDataDto) {
    if (!pdfData) {
      this.pdfData.emit(undefined)
      return
    }
    this.courtine.startCourtine()
    this.pdfDataservice
      .getByName$(pdfData.name, this.artist.signature)
      .pipe(tap(() => this.courtine.stopCourtine()))
      .subscribe(pdfData => this.pdfData.emit(pdfData))
  }

  _preview(pdfData: PdfDataDto) {
    const url = pdfData.id 
      ? `/pdf-data/preview/${pdfData.id}`
      : `/pdf-data/preview-default/${pdfData.template}`
    const filename = `${pdfData.template.toLocaleLowerCase()}-preview`
    this.documentService.documentRequestFullUrl(url, undefined, filename)
  }

  _toggleSectionMenu(menu: Menu, event: Event) {
    event.stopPropagation()
    menu?.toggle(event)
  }

  private sortFirstActiveAfterByModified(pdfDatas: PdfDataDto[]) {
    pdfDatas.sort((a, b) => {
      const aNumber = Number(a.active);
      const bNumber = Number(b.active);
      if (aNumber === bNumber) {
        return new Date(b.modified).getTime() - new Date(a.modified).getTime()
      }
      return bNumber - aNumber
    })
  }

  _noneActive(pdfDatas?: PdfDataDto[]) {
    return (pdfDatas || []).every(pdfData => !pdfData.active)
  } 

}
