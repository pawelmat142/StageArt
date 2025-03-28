import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { SubstepComponent } from '../../../booking/view/booking-stepper/substep/substep.component';
import { ChecklistTile } from '../../../booking/interface/checklist.interface';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { BookingDto } from '../../../booking/services/booking.service';
import { DocumentService } from '../../document/document.service';
import { ChecklistUtil } from '../../../booking/checklist.util';
import { SignatureService } from '../sign/signature.service';
import { UploadsService } from '../../document/uploads.service';
import { catchError, filter, mergeMap, of, switchMap, tap } from 'rxjs';
import { Template } from '../../document/doc-util';
import { Dialog } from '../../nav/dialog.service';
import { CourtineService } from '../../nav/courtine.service';
import { BookingUtil } from '../../../booking/booking.util';
import { MenuDropdownComponent } from '../menu-dropdown/menu-dropdown.component';

@Component({
  selector: 'app-paper-tile',
  standalone: true,
  imports: [
    CommonModule,
    SubstepComponent,
    MenuModule,
    MenuDropdownComponent
  ],
  templateUrl: './paper-tile.component.html',
  styleUrl: './paper-tile.component.scss',
})
export class PaperTileComponent {

  constructor(
    private readonly documentService: DocumentService,
    private readonly signatureService: SignatureService,
    private readonly uploadsService: UploadsService,
    private readonly dialog: Dialog,
    private readonly courtine: CourtineService,
  ) {}

  @Input() tile!: ChecklistTile
  @Input() booking!: BookingDto
  @Input() uid?: string

  tileOptions: MenuItem[] = []

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['tile']) {
      return
    }
    this.tileOptions = []
    if (this.booking.status !== 'DOCUMENTS') {
      return
    }
    if (ChecklistUtil.canGenerate(this.tile)) {
      this.tileOptions.push({
        label: 'Generate',
        command: () => this.documentService.generate(this.booking, this.tile.template!)
      })
    }
    if (ChecklistUtil.canSign(this.tile)) {
      this.tileOptions.push({
        label: 'Sign document',
        command: () => this.signatureService.showSection()
      })
    }
    if (ChecklistUtil.canVerifyAndSign(this.tile)) {
      this.tileOptions.push({
        label: 'Sign and verify document',
        command: () => this.signatureService.showSection()
      })
    }
    if (ChecklistUtil.canVerify(this.tile)) {
      this.tileOptions.push({
        label: 'Verify document',
        command: () => this.verifyFile()
      })
    }
    if (ChecklistUtil.canDownload(this.tile)) {
      this.tileOptions.push({
        label: 'Download template',
        command: () => this.documentService.download(this.tile.paperId!)
      })
    }
    if (ChecklistUtil.canDownloadUploaded(this.tile)) {
      this.tileOptions.push({
        label: 'Download file',
        command: () => this.downloadFile(this.tile.paperId)
      })
    }
    if (ChecklistUtil.canUpload(this.tile)) {
      this.tileOptions.push({
        label: 'Upload file',
        command: () => this.uploadFile('rental-proof')
      })
    }
    if (ChecklistUtil.canDelete(this.tile)) {
      this.tileOptions.push({
        label: 'Delete file',
        command: () => this.deleteFile(this.tile.paperId)
      })
    }

    if (ChecklistUtil.canDownloadSigned(this.tile)) {
      this.tileOptions.push({
        label: 'Download signed document',
        command: () => this.documentService.downloadSignedPaper(this.tile.paperId!)
      })
    }

    this.tileOptions.push({
      label: 'Refresh',
      command: () => this.documentService.refreshChecklist$(this.booking).subscribe()
    })

    this.items = [{
      label: 'Options',
      items: this.tileOptions
    }]
  }

  items: MenuItem[] = []

  private verifyFile() {
    this.courtine.startCourtine()
    this.uploadsService.verifyPaperFile(this.tile.paperId!).pipe(
      mergeMap(() => this.documentService.refreshChecklist$(this.booking)),
      catchError(error => {
        this.dialog.errorPopup(error)
        return of(null)
      }),
      tap(() => this.courtine.stopCourtine()),
    ).subscribe()
  }

  private uploadFile(template: Template) {
    this.courtine.startCourtine()



    this.uploadsService.uploadFile(this.booking, template).pipe(
      filter(paper => !!paper),
      switchMap(() => this.documentService.refreshChecklist$(this.booking)),
      tap(() => this.courtine.stopCourtine()),
      catchError(error => {
        this.courtine.stopCourtine()
        this.dialog.errorPopup(error)
        return of(null)
      }),
    ).subscribe()
  }

  private downloadFile(paperId?: string) {
    if (!paperId) {
      this.dialog.errorToast(`No such file!`)
      return
    }
    this.documentService.documentRequest(`/upload/${paperId}`)
  }

  private deleteFile(paperId?: string) {
    if (!paperId) {
      this.dialog.errorToast(`No such file!`)
      return
    }
    this.dialog.yesOrNoPopup(`Are you sure you want to delete this file?`).pipe(
      tap((confirmed) => this.courtine.startCourtine() ),
      switchMap(confirmed => confirmed ? this.documentService.deletePaper$(paperId) : of(null)),
      switchMap((deleted) => {
        if (deleted?.deleted) {
          return this.documentService.refreshChecklist$(this.booking)
        }
        return of(null)
      }),
      catchError(error => {
        this.dialog.errorPopup(error)
        return of()
      }),
      tap(() => this.courtine.stopCourtine()),
    ).subscribe()
  }

  private forRole(role: string): boolean {
    if (!this.uid || !this.booking) {
      return false
    }
    return BookingUtil.bookingRoles(this.booking, this.uid).includes(role)
  }

}