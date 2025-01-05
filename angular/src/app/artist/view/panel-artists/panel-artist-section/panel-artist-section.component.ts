import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArtistStatus, ArtistViewDto } from '../../../model/artist-view.dto';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem } from 'primeng/api';
import { ReactiveFormsModule } from '@angular/forms';
import { CourtineService } from '../../../../global/nav/courtine.service';
import { ArtistService } from '../../../artist.service';
import { ButtonModule } from 'primeng/button';
import { TextareaElementComponent } from '../../../../global/controls/textarea-element/textarea-element.component';
import { FormFieldComponent } from '../../../../global/controls/form-field/form-field.component';
import { finalize, map, tap } from 'rxjs';
import { DocumentTemplatesComponent } from '../../document-templates/document-templates.component';
import { NavService } from '../../../../global/nav/nav.service';
import { PdfDataDto } from '../../../model/document-template.def';
import { DoocumentTemplateEditorComponent } from '../../document-templates/doocument-template-editor/doocument-template-editor.component';
import { BookingDto, BookingService } from '../../../../booking/services/booking.service';
import { PanelMenuService } from '../../../../profile/view/sidebar/panel-menu.service';

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
    private readonly bookingService: BookingService,
    private readonly panelMenuService: PanelMenuService,
    private readonly nav: NavService,
  ) {}

  @Input() artist!: ArtistViewDto

  @Output() breadcrumb = new EventEmitter<MenuItem[]>()
  @Output() refresh = new EventEmitter()

  _bookings: BookingDto[] = []

  ngOnInit(): void {
    this.bookingService.panelArtistBookings$(this.artist.signature).subscribe(bookings => this._bookings = bookings)
  }

  _managmentNotes = ''

  activeIndexManagementNotes: number | undefined = undefined
  activeIndexBookings: number | undefined = undefined
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

  _toggleBookings($event: any) {
    this._closePdfData()
    this._closeManagementNotes()
    this._closeDocumentTemplates()
    if (Number.isInteger($event)) { 
      this.breadcrumb.emit([{
        label: this.artist.name,
        command: () => this._closeBookingsAccordion()
      }, {
        label: `Bookings`
      }])
    } else {
      this._closeBookingsAccordion()
    }
  }

  _closeBookingsAccordion() {
    this.activeIndexBookings = -1
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

  _navToPanelBooking(booking: BookingDto) {
    this.courtineService.startCourtine()
    this.bookingService.fetchFullBooking$(booking.formId).pipe(
      map(b => this.panelMenuService.panelNavToBookings(b)),
      tap(() => this.courtineService.stopCourtine())
    ).subscribe()
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
