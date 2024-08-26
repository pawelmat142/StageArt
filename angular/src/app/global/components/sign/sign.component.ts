import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import SignaturePad from 'signature_pad';
import { HandSignature, ProfileService } from '../../../profile/profile.service';
import { DESKTOP } from '../../services/device';
import { DialogService } from '../../nav/dialog.service';
import { CourtineService } from '../../nav/courtine.service';


@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [
  ],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SignComponent {

  readonly DESKTOP = DESKTOP

  constructor (
    private readonly profileService: ProfileService,
    private readonly dialog: DialogService,
    private readonly courtine: CourtineService,
  ) {}

  signatureNeeded!: boolean;
  signaturePad!: SignaturePad;
  signatureImg!: string;

  width = 700
  height = 200

  @ViewChild('canvas') canvasEl!: ElementRef;

  ngOnInit(): void {
    const standardPadding = 16
    if (!this.DESKTOP) {
      this.width = innerWidth - 2*standardPadding
    }
  }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement)
    this.fetchSignature()
  }

  clearPad() {
    this.signaturePad.clear();
  }

  fetchSignature() {
    this.courtine.startCourtine()
    this.profileService.fetchSignature$().pipe().subscribe({
      next: (result) => {
        this.signaturePad.fromDataURL(result.base64data, {
          width: result.size.width,
          height: result.size.height
        })
        this.courtine.stopCourtine()
      },
      error: error => {
        this.courtine.stopCourtine()
        this.dialog.errorPopup(error.error.message)
      }
    })
  }

  setSignature() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.signatureNeeded = this.signaturePad.isEmpty();
    if (!this.signatureNeeded) {
      this.signatureNeeded = false;
    }
    const signature: HandSignature = {
      base64data: base64Data,
      date: new Date(),
      size: {
        width: this.canvasEl.nativeElement.width,
        height: this.canvasEl.nativeElement.height,
      }
    }
    this.courtine.startCourtine()
    this.profileService.setSignature$(signature).pipe().subscribe({
      next: (result) => {
        this.courtine.stopCourtine()
        this.dialog.simplePopup('Signature uploaded')
      },
      error: error => {
        this.courtine.stopCourtine()
        this.dialog.errorPopup(error.error.message)
      }
    })
  }
}
