import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Injector, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { IconButtonComponent } from '../../components/icon-button/icon-button.component';
import { DialogData } from '../../components/popup/popup.component';
import { NavService } from '../../../services/nav.service';
import { FileViewComponent } from './file-view/file-view.component';

@Component({
  selector: 'app-file-loader',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconButtonComponent,
    FileViewComponent,
  ],
  templateUrl: './file-loader.component.html',
  styleUrl: './file-loader.component.scss',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileLoaderComponent),
    multi: true
  }]
})
export class FileLoaderComponent implements ControlValueAccessor {

  file: File | null = null

  private onChange: (file: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  registerOnChange(fn: (file: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement this method if you want to handle disabled state
  }

  writeValue(file: File | null): void {
    this.file = file;
  }

  
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.setValue(input.files[0])
    }
  }

  constructor(
    private injector: Injector,
    private nav: NavService,
  ) {}

  @ViewChild('formFileLoader') formFileLoader!: ElementRef<HTMLInputElement>;
  @ViewChild('loaderControl') loaderControl!: ElementRef<HTMLInputElement>;

  @Output() removeControl = new EventEmitter<void>()

  @Input() label!: string
  _label: string = '';

  @Input() required: boolean = false
  @Input() placeholder: string = ''
  @Input() extensions: string[] = ['jpg', 'png']

  @Input() circle = false

  private ngControl?: NgControl

  ngOnInit(): void {
    this._label = this.required ? `*${this.label}` : this.label
    this.ngControl = this.injector.get(NgControl);
  }


  _active = false

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._active = true;
  }
  
  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._active = false;
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this._active = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]
      this.setValue(file)
    }
  }

  private setValue(value: File | null) {
    if (!value) {
      this._setValue(null)
    } else {
      if (this.validateExtension(value)) {
        this._setValue(value)
      } else {
        this.setValue(null)
      }
    }
  }

  private _setValue(value: File | null) {
    this.file = value
    this.onChange(this.file)
    this.onTouched()
  }

  _openFileSelector() {
    this.loaderControl.nativeElement.click()
  }


  _removeFile() {
    this.setValue(null)
    this.file = null
    this.onChange(null);
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
    this.nav.popup(data)
  }

}
