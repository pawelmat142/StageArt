import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-view',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './file-view.component.html',
  styleUrl: './file-view.component.scss'
})
export class FileViewComponent implements OnChanges {

  constructor(
    private readonly elementRef: ElementRef
  ) {}

  _imageSrc: string | ArrayBuffer | null = null

  @Input() file?: File
  @Input() circle = false

  _width!: number

  @HostListener('window:resize', ['$event.target'])
  getWidth() {
    this._width = this.elementRef.nativeElement.offsetWidth
    console.log(this._width)
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file'] && !changes['file'].isFirstChange()) {
      this.getWidth()

      if (this.file) {
        const reader = new FileReader()
        
        reader.onload = e => {
          this._imageSrc = reader.result
        }
    
        if (this.file) {
          reader.readAsDataURL(this.file)
          this.getWidth()
        }

      } else {
        this._imageSrc = null
      }
    }

  }



}
