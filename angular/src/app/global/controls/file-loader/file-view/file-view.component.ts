import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-file-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProgressSpinnerModule
  ],
  templateUrl: './file-view.component.html',
  styleUrl: './file-view.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FileViewComponent implements OnChanges {

  constructor(
    private readonly elementRef: ElementRef
  ) {}

  _imageSrc: string | ArrayBuffer | null = null

  @Input() file?: File
  @Input() circle = false
  @Input() loading = false

  _width!: number

  @HostListener('window:resize', ['$event.target'])
  getWidth() {
    this._width = this.elementRef.nativeElement.offsetWidth
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file']) {
      this.getWidth()

      if (this.file) {
        const reader = new FileReader()
        
        reader.onload = e => {
          this._imageSrc = reader.result
          this.getWidth()
        }
        reader.readAsDataURL(this.file)
        
      } else {
        this._imageSrc = null
      }
    }
  }

}
