import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { catchError, concatMap, map, of, tap } from 'rxjs';
import { ImgUtil } from '../../../global/utils/img.util';

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
        .pipe(
          concatMap(blob => ImgUtil.blobToBase64$(blob)),
          tap(base64 => {
            localStorage.setItem(this.src, base64)
            this.imageSrc = base64
          }),
          catchError(error => {
            this.error = true
            console.error(error)
            return of(null)
          })
        )
        .subscribe()
      }
    }
  }







  









}
