import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-img-cached',
  standalone: true,
  imports: [],
  templateUrl: './img-cached.component.html',
  styleUrl: './img-cached.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ImgCachedComponent {

  @Input() src!: string
  @Input() alt!: string
  @Input() resizeTo?: number    // max width/height to resize before save in local storage

  imageSrc?: string

  error = false;
  
  constructor(
    private readonly httpClient: HttpClient
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.error = false
    if (changes['src']) {
      const cached = localStorage.getItem(this.src)
      if (cached) {
        this.imageSrc = cached
      } else {
        this.httpClient.get(this.src, { responseType: 'blob' })
        .pipe(catchError(e => {
          this.error = true
          console.error('error loading image')
          return of(null)
        }))
        .subscribe(async blob => {
          if (blob instanceof Blob) {
            const base64 = await this.prepareBase64(blob)
            localStorage.setItem(this.src, base64)
            this.imageSrc = base64
          } else {
            this.error = true
            console.error("NOT BLOB")
          }
        })
      }
    }
  }

  private async prepareBase64(blob: Blob): Promise<string> {
    if (this.resizeTo) {
      const image = await this.blobToImage(blob)
      if (image) {
        const _blob = await this.resizeImage(image)
        if (_blob) {
          return this.blobToBase64(_blob)
        }
      }
    }
    return this.blobToBase64(blob)
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string)
        };
        reader.onerror = () => {
          this.error = true
          reject()
        };
        reader.readAsDataURL(blob);
    });
  }


  blobToImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          this.error = true
          reject()
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(blob);
    });
  }


  resizeImage(image: HTMLImageElement, maxWidth = this.resizeTo!, maxHeight = this.resizeTo!): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      if (!ctx) {
        this.error = true
        console.error('Failed to get canvas context')
        return reject();
      }
  
      // Calculate the new dimensions
      let width = image.width;
      let height = image.height;

      if (width >= height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
  
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
  
      // Draw the image
      ctx.drawImage(image, 0, 0, width, height);
  
      // Convert canvas to Blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          this.error = true
          console.error('Failed to convert canvas to blob')
          reject()
        }
      }, 'image/jpeg'); // You can use other formats like 'image/png'
    });
  }
  









}
