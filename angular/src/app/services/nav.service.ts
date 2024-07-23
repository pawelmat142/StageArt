import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(
    private readonly router: Router,
  ) { }

  public to(path: string) {
    this.router.navigateByUrl(path)
  }
}
