import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface MenuButtonItem {
  label: string
  onclick(): void
}

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(
    private readonly router: Router,
  ) { }


  private menuButtonOverhiddenSubject$ = new BehaviorSubject(false)
  public get menuButtonOverhidden$() {
    return this.menuButtonOverhiddenSubject$.asObservable()
  }
  public set menuButtonOverhidden(isOnView: boolean) {
    this.menuButtonOverhiddenSubject$.next(isOnView)
  }

  private readonly _menuButtons: MenuButtonItem[] = [{
    label: "ADD",
    onclick: () => this.to('add-artist')
  }, {
    label: "Artists",
    onclick: () => this.to('test')
  }]

  public get menuButtons(): MenuButtonItem[] {
    return this._menuButtons
  }

  
  public home() {
    this.router.navigate([''], { replaceUrl: true })
  }

  public to(path: string) {
    this.router.navigateByUrl(path)
  }

}
