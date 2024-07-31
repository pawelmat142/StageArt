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
          return of(null)
        }))
        .subscribe(async blob => {
          if (blob instanceof Blob) {
            const base64 = await this.blobToBase64(blob)
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

}
