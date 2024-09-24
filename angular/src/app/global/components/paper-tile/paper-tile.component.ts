import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { SubstepComponent } from '../../../booking/view/booking-stepper/substep/substep.component';
import { ChecklistTile } from '../../../booking/interface/checklist.interface';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { BookingDto } from '../../../booking/services/booking.service';
import { DocumentService } from '../../document/document.service';
import { ChecklistUtil } from '../../../booking/checklist.util';
import { SignatureService } from '../sign/signature.service';

@Component({
  selector: 'app-paper-tile',
  standalone: true,
  imports: [
    CommonModule,
    SubstepComponent,
    MenuModule,
    IconButtonComponent,
  ],
  templateUrl: './paper-tile.component.html',
  styleUrl: './paper-tile.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PaperTileComponent {

  constructor(
    private readonly documentService: DocumentService,
    private readonly signatureService: SignatureService,
  ) {}

  @Input() tile!: ChecklistTile
  @Input() booking!: BookingDto

  @ViewChild('menu') menuRef!: Menu

  private signDocument() {
    this.signatureService.showSection()
  }

  tileOptions: MenuItem[] = []

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['tile']) {
      return
    }
    this.tileOptions = []
    if (ChecklistUtil.canGenerate(this.tile)) {
      this.tileOptions.push({
        label: 'Generate',
        command: () => this.documentService.generate(this.booking, this.tile.template!)
      })
    }
    if (ChecklistUtil.canSign(this.tile)) {
      this.tileOptions.push({
        label: 'Sign document',
        command: () => this.signDocument()
      }),
      this.tileOptions.push({
        label: 'Upload signed',
        // TODO
        // command: () => this.documentService.sign(this.tile.paperId!)
      })
    }
    if (ChecklistUtil.canDownload(this.tile)) {
      this.tileOptions.push({
        label: 'Download template',
        command: () => this.documentService.download(this.tile.paperId!)
      })
    }
    if (ChecklistUtil.canUpload(this.tile)) {
      this.tileOptions.push({
        label: 'Upload document',
        command: () => this.documentService.upload(this.tile.paperId!)
      })
    }
    if (ChecklistUtil.canVerify(this.tile)) {
      this.tileOptions.push({
        label: 'Verify document',
        command: () => this.documentService.verify(this.tile.paperId!)
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
      command: () => this.documentService.refreshChecklist$(this.booking)
    })

    this.items = [{
      label: 'Options',
      items: this.tileOptions
    }]
  }

  items: MenuItem[] = []

  _toggle(event: Event) {
    this.menuRef?.toggle(event)
  }

}
