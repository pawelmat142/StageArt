import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ArtistStatus, ArtistViewDto } from '../../../model/artist-view.dto';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CourtineService } from '../../../../global/nav/courtine.service';
import { ArtistService } from '../../../artist.service';
import { ButtonModule } from 'primeng/button';
import { TextareaElementComponent } from '../../../../global/controls/textarea-element/textarea-element.component';
import { FormFieldComponent } from '../../../../global/controls/form-field/form-field.component';
import { tap } from 'rxjs';
import { DocumentTemplatesComponent } from '../../document-templates/document-templates.component';
import { NavService } from '../../../../global/nav/nav.service';
import { PdfDataDto } from '../../../model/document-template.def';
import { DoocumentTemplateEditorComponent } from '../../document-templates/doocument-template-editor/doocument-template-editor.component';

@Component({
  selector: 'app-panel-artist-section',
  standalone: true,
  imports: [
    CommonModule,
    AccordionModule,
    ReactiveFormsModule,
    ButtonModule,
    TextareaElementComponent,
    FormFieldComponent,
    DocumentTemplatesComponent,
    DoocumentTemplateEditorComponent
  ],
  templateUrl: './panel-artist-section.component.html',
  styleUrl: './panel-artist-section.component.scss'
})
export class PanelArtistSectionComponent implements OnInit {

  constructor(
    private readonly courtineService: CourtineService,
    private readonly artistService: ArtistService,
    private readonly nav: NavService,
  ) {}


  @Input() artist!: ArtistViewDto

  @Output() breadcrumb = new EventEmitter<MenuItem[]>()
  @Output() refresh = new EventEmitter()

  ngOnInit(): void {
  }

  _managmentNotes = ''

  activeIndexManagementNotes: number | undefined = undefined
  activeIndexDocumentTemplates: number | undefined = undefined


  pdfData?: PdfDataDto

  _toggleManagementNotes($event: any) {
    this._closePdfData()
    if (Number.isInteger($event)) {
      this._closeDocumentTemplates()
      this.breadcrumb.emit([{
        label: this.artist.name,
        command: () => this._closeManagementNotes()
      }, {
        label: `Management notes`
      }])
      this._managmentNotes = this.artist.managmentNotes
    } else {
      this._closeManagementNotes()
    }
  }

  _documentTemplates = false

  _toggleDocumentTemplates($event: any) {
    if (Number.isInteger($event)) {
      this._closeManagementNotes()
      this.closeAccordionManagementNotes()
      this._closePdfData()
      this._documentTemplates = true
    } else {
      this._closeDocumentTemplates()
    }
  }

  _togglePdfData(pdfData?: PdfDataDto) {
    if (pdfData) {
      this.pdfData = pdfData
      this._closeManagementNotes()
      this._closeDocumentTemplates()
      this.breadcrumb.emit(this.getPdfDataBreadcrumbs())
    } else {
      this._closePdfData()
    }
  }

  _closePdfData() {
    this.pdfData = undefined
    this.breadcrumb.emit(this.getDocumentTemplatesBreadcrumbs())
  }

  private getPdfDataBreadcrumbs(): MenuItem[] {
    const result = this.getDocumentTemplatesBreadcrumbs()
    result.push({
      label: this.pdfData?.template
    })
    return result
  }

  private getDocumentTemplatesBreadcrumbs(): MenuItem[] {
    const result = [{
      label: this.artist.name,
      command: () => this._closeDocumentTemplates()
    }, {
      label: 'Document templates',
      command: () => this._closePdfData()
    }]
    return result
  }

  _documentTemapltesDreadcrumb(menuItems?: MenuItem[]) {
    const item = menuItems?.[0]
    if (item) {
      const result = this.getDocumentTemplatesBreadcrumbs()
      result.push(item)
      this.breadcrumb.emit(result)
    } else {
      this.breadcrumb.emit(this.getDocumentTemplatesBreadcrumbs())
    }
  }

  _closeDocumentTemplates() {
    this._documentTemplates = false
    this.breadcrumb.emit(undefined)
    this.activeIndexDocumentTemplates = -1
  }

  _closeManagementNotes() {
    this._managmentNotes = ''
    this.breadcrumb.emit(undefined)
    this.closeAccordionManagementNotes()
  }

  closeAccordionManagementNotes() {
    this.activeIndexManagementNotes = -1
  }

  _onInput(event: any) {
    this._managmentNotes = event.target?.value
  }

  _submitManagementNotes() {
    if (!this._managmentNotes) {
      return
    }
    this.courtineService.startCourtine()
    this.artistService.putManagementNotes$({
      managmentNotes: this._managmentNotes,
      artistSignture: this.artist?.signature || ''
    }).pipe(
      tap(() => this.courtineService.stopCourtine())
    ).subscribe(() => {
      this._closeManagementNotes()
      this.closeAccordionManagementNotes()
      this.refresh.emit()
    })
  }

  _artistView(artist: ArtistViewDto) {
    this.nav.toArtist(artist.name)
  }

  
  _activate(artist: ArtistViewDto) {
    this.setArtistStatus(artist, 'ACTIVE')
  }
  
  _deactivate(artist: ArtistViewDto) {
    this.setArtistStatus(artist, 'INACTIVE')
  }

  private setArtistStatus(artist: ArtistViewDto, status: ArtistStatus) {
    this.courtineService.startCourtine()
    this.artistService.setStatus$(status, artist.signature).pipe(
      tap(() => this.courtineService.stopCourtine())
    ).subscribe(() => {
      this._closeManagementNotes()
      this.closeAccordionManagementNotes()
      this._closeDocumentTemplates()
      this.refresh.emit()
    })
  }

}
