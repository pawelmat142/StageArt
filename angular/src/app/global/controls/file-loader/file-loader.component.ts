import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Injector, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FileViewComponent } from './file-view/file-view.component';
import { AbstractControlComponent } from '../abstract-control/abstract-control.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { tap } from 'rxjs';
import { DialogData } from '../../nav/dialogs/popup/popup.component';
import { ImgUtil } from '../../utils/img.util';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';
import { DialogService } from '../../nav/dialog.service';
import { NavService } from '../../nav/nav.service';

@Component({
  selector: 'app-file-loader',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconButtonComponent,
    FileViewComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './file-loader.component.html',
  styleUrl: './file-loader.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileLoaderComponent),
    multi: true
  }]
})
export class FileLoaderComponent extends AbstractControlComponent<File | null> {

  constructor(
    elementRef: ElementRef,
    injector: Injector,
    private nav: NavService,
    private dialog: DialogService,
  ) {
    super(elementRef, injector);
  }


  @Output() removeControl = new EventEmitter<void>()

  @Input() circle = false
  @Input() extensions = ['jpg', 'png']
  @Input() resultFileName?: string

  _loading = false

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.active = true;
  }
  
  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.active = true;
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.active = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]
      this.setValue(file)
    }
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0]
      this.convertAndSetValue(file)
    }
  }

  private async convertAndSetValue(value: File | null) {
    this.setValue(null)
    if (value) {
      this._loading = true
      ImgUtil.resizeImgFile$(value).pipe(tap(file => {
          this.setValue(file)
          this._loading = false
        })).subscribe()
    }
  }

  private setValue(value: File | null) {
    if (!value) {
      super.updateValue(null)
    } else {
      if (this.validateExtension(value)) {
        super.updateValue(value)
      } else {
        super.updateValue(null)
      }
    }
  }


  _openFileSelector() {
    this.input!.click()
  }

  _removeFile() {
    super.updateValue(null)
  }

  private validateExtension(value: File): boolean {
    const split = value.name.split('.')
    if (split.length) {
      const extenstion = split[split.length-1]
      if (this.extensions.includes(extenstion)) {
        return true
      } else {
        this.wrongExtensionPopup(extenstion)
      }
    }
    return false
  }

  private wrongExtensionPopup(extenstion: string) {
    const data: DialogData = {
      header: `Wrong extension: ${extenstion}`,
      content: [`Available extensions: ${this.extensions.join(', ')}`]
    }
    this.dialog.popup(data)
  }

}
