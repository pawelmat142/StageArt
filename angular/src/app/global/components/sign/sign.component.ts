import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import SignaturePad from 'signature_pad';
import { DESKTOP } from '../../services/device';
import { ImgUtil } from '../../utils/img.util';
import { Signature, SignatureService } from './signature.service';
import { filter, map, Observable, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { Dialog } from '../../nav/dialog.service';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { CommonModule } from '@angular/common';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CourtineService } from '../../nav/courtine.service';
import { DocumentService } from '../../document/document.service';
import { BookingDto } from '../../../booking/services/booking.service';
import { BookingUtil } from '../../../booking/booking.util';
import { uid } from '../../../profile/profile.state';
import { Role } from '../../../profile/profile.model';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
    MenuModule,
    ButtonModule
  ],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss',
})
export class SignComponent {

  readonly DESKTOP = DESKTOP

  constructor (
    private readonly signatureService: SignatureService,
    private readonly documentService: DocumentService,
    private readonly dialog: Dialog,
    private readonly store: Store<AppState>,
    private readonly courtine: CourtineService,
  ) {}

  signaturePad?: SignaturePad;
  signatureImg!: string;

  width = 700
  height = this.DESKTOP ? 200 : 150

  @ViewChild('menu') menuRef!: Menu
  @ViewChild('canvas') canvasEl!: ElementRef;
  @ViewChild('signatureSection') signatureSection!: ElementRef;
  @ViewChildren('signatureRowMenu') signatureRowMenu!: QueryList<Menu>;


  _selectedBooking$: Observable<BookingDto | undefined> = this.store.select(state => state.profileState.selectedBooking)

  _paperIdToSign$ = this._selectedBooking$.pipe(
    withLatestFrom(this.store.select(uid)),
    map(([booking, uid]) => {
      if (!booking || !uid) {
        return
      }
      const roles = BookingUtil.bookingRoles(booking, uid)
      if (roles.includes(Role.PROMOTER)) {
        return booking?.checklist.find(c => {
          return c.template === 'contract'
            && c.steps.find(s => s.type === 'generate')?.ready
            && !c.steps.find(s => s.type === 'sign')?.ready
        })?.paperId
      }
      if (roles.includes(Role.MANAGER)) {
        return booking?.checklist.find(c => {
          return c.template === 'contract'
            && c.steps.find(s => s.type === 'sign')?.ready
            && !c.steps.find(s => s.type === 'verifyAndSign')?.ready
        })?.paperId
      }
      return
    })
  )

  _showSection$ = this.signatureService.showSection$.asObservable().pipe(
    tap((show) => this.initSection(show))
  )

  _drawOn = false
  _clean = true
  _on() {
    this.signaturePad?.on()
    this._drawOn = true
    document.addEventListener('click', this._onDrawStop)
    document.addEventListener('touchend', this._onDrawStop)
  }
  
  _off() {
    this.signaturePad?.off()
    this._drawOn = false
    document.removeEventListener('click', this._onDrawStop)
    document.removeEventListener('touchend', this._onDrawStop)
  }

  _onDrawStop = () => {
    if (!this._drawOn) {
      return
    }
    this.refreshCleanFlag()
  }

  _clearPad() {
    this.signaturePad?.clear();
    this.refreshCleanFlag()
  }

  _save() {
    if (this.signaturePad?.isEmpty()) {
      return 
    }
    const base64Data = this.signaturePad?.toDataURL();
    if (!base64Data) {
      return
    }
    this.signatureImg = base64Data;
    this.courtine.startCourtine()
    this.signatureService.putSignature$({
      base64data: base64Data,
      size: {
        width: this.canvasEl.nativeElement.width,
        height: this.canvasEl.nativeElement.height,
      },
    }).pipe(
      tap(signatureId => {
        this.dialog.succesToast(`Signature saved!`)
        if (signatureId?.id) {
          this.reloadSignatures({ signatureIdToSelect: signatureId.id })
        }
      }),
    ).subscribe()
  }

  private refreshCleanFlag() {
    this._clean = this.signaturePad ? this.signaturePad.isEmpty() : true
  }

  _signatures$ = this.signatureService.listSignatures$().pipe(
    tap(signatures => {
      if (signatures.length) {
        this._select(signatures[0])
      }
    })
  )

  _selectedSignature?: Signature

  _select = (signature: Signature) => {
    this._selectedSignature = signature
    this.printSignatureInPad(signature)
    this.refreshMenuItems()
    this._off()
  }
  
  _unselect() {
    this._selectedSignature = undefined
    this._clearPad()
    this.refreshMenuItems()
    this._on()
  }


  private initSection(show: boolean) {
    if (show) {
      const standardPadding = 16
      if (!this.DESKTOP) {
        this.width = innerWidth - 2*standardPadding
      }
      setTimeout(() => {
        this.signaturePad = new SignaturePad(this.canvasEl.nativeElement)
        this._on()
        this.signatureSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  private printSignatureInPad(signature: Signature) {
    if (signature) {
      this.signaturePad?.clear()
      this.signaturePad?.fromDataURL(signature.base64data, {
        width: signature.size.width,
        height: signature.size.height
      })
      this.refreshCleanFlag()
    }
  }

  _downloadSignature() {
      const base64Data = this.signaturePad?.toDataURL()
      if (!base64Data) {
        return
      }
      ImgUtil.downloadImgFromBase64(base64Data, 'handwritten-signature.png')
  }

  _remove(signature: Signature) {
    this.dialog.yesOrNoPopup(`Sure?`).pipe(
      switchMap(confirm => {
        if (confirm) {
          this.courtine.startCourtine()
          return this.signatureService.cancelSignature$(signature.id).pipe(
            tap(() => {
              this.reloadSignatures()
              this.dialog.succesToast(`Signature removed`)
            })
          )
        }
        return of()
      }
      )).subscribe()
  }

  private reloadSignatures = (params?: { signatureIdToSelect: string }) => {
    this._signatures$ = this.signatureService.listSignatures$().pipe(
      tap((signatures) => {
        if (params?.signatureIdToSelect) {
          const signature = signatures.find(s => s.id === params.signatureIdToSelect)
          if (signature) {
            this._select(signature)
          }
        }
      })
    )
  }

  _signPaper(booking: BookingDto, paperIdToSign: string) {
    if (!paperIdToSign || !this._selectedSignature?.id) {
      return
    }
    this.dialog.yesOrNoPopup(`Sure?`).pipe(
      filter(confirm => !!confirm),
      tap(() => this.documentService.signPaper(paperIdToSign, this._selectedSignature!.id, booking)),
      tap(() => this.signatureService.closeSection()),
    ).subscribe()
  }


  
  // MENU

  _menuToggle(event: Event) {
    this.menuRef?.toggle(event)
  }

  private readonly closeMenuItem: MenuItem = {
    label: 'Close',
    command: () => this.signatureService.closeSection()
  }

  _menuItems: MenuItem[] = [
    this.closeMenuItem
  ]

  refreshMenuItems() {
    this._menuItems = []
    if (this._selectedSignature) {
      this._menuItems.push({
        label: 'Start new',
        command: (e) => {
          this._unselect()
        }
      })
    }
    this._menuItems.push(this.closeMenuItem)
  }


}
