import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import SignaturePad from 'signature_pad';
import { HandSignature } from '../../../profile/profile.service';
import { DESKTOP } from '../../services/device';
import { BtnComponent } from '../../controls/btn/btn.component';
import { ImgUtil } from '../../utils/img.util';
import { SignatureService } from './signature.service';
import { Observable, Subscription, tap } from 'rxjs';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { handSignature } from '../../../profile/profile.state';
import { DialogService } from '../../nav/dialog.service';


@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [
    BtnComponent,
  ],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SignComponent {

  readonly DESKTOP = DESKTOP

  constructor (
    private readonly signatureService: SignatureService,
    private readonly dialog: DialogService,
    private readonly store: Store<AppState>,
  ) {}

  signaturePad?: SignaturePad;
  signatureImg!: string;

  width = 700
  height = 200

  _handSignature$?: Observable<HandSignature>

  @ViewChild('canvas') canvasEl!: ElementRef;

  subscription?: Subscription

  ngOnInit(): void {
    const standardPadding = 16
    if (!this.DESKTOP) {
      this.width = innerWidth - 2*standardPadding
    }
    this.subscription = this.store.select(handSignature).pipe(
      tap(signature => signature 
        ? this.printSignatureInPad(signature)
        : this.signaturePad?.clear()
      )
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.canvasEl.nativeElement)
    this.fetchSignature()
  }

  _clearPad() {
    this.signaturePad?.clear();
  }

  fetchSignature() {
    this.signatureService.fetchSignature$()
  }

  private printSignatureInPad(signature: HandSignature) {
    if (signature) {
      this.signaturePad?.fromDataURL(signature.base64data, {
        width: signature.size.width,
        height: signature.size.height
      })
    }
  }

  _submit() {
    if (this.signaturePad?.isEmpty()) {
      this.dialog.yesOrNoPopup(`Your signature will be removed from the system`).subscribe(confirm => {
        if (confirm) {
          this.signatureService.removeSignature$()
        }
      })
      return
    }
    const base64Data = this.signaturePad?.toDataURL();
    if (!base64Data) {
      return
    }
    this.signatureImg = base64Data;

    const signature: HandSignature = {
      base64data: base64Data,
      date: new Date(),
      size: {
        width: this.canvasEl.nativeElement.width,
        height: this.canvasEl.nativeElement.height,
      }
    }
    this.signatureService.setSignature$(signature)
  }

  _downloadSignature() {
      const base64Data = this.signaturePad?.toDataURL()
      if (!base64Data) {
        return
      }
      ImgUtil.downloadImgFromBase64(base64Data, 'handwritten-signature.png')
  }
}
