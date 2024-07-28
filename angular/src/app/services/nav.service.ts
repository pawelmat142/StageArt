import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DialogData, PopupComponent } from '../pages/components/popup/popup.component';
import { ArtistFormComponent } from '../pages/admin/pages/artist-form/artist-form.component';
import { NotFoundPageComponent } from '../pages/error/not-found-page/not-found-page.component';

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
    private readonly dialog: MatDialog
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
    onclick: () => this.to(ArtistFormComponent.path)
  }, {
    label: "Artists",
    onclick: () => this.to('test')
  }, {
    label: "Test",
    onclick: () => this.router.navigate(['artist', 'Ebebe'])
  }]

  public get menuButtons(): MenuButtonItem[] {
    return this._menuButtons
  }

  
  public home() {
    this.router.navigate([''], { replaceUrl: true })
  }

  public toNotFound() {
    this.router.navigate([NotFoundPageComponent.path], { replaceUrl: true })
  }

  public to(path: string) {
    this.router.navigateByUrl(path)
  }


  public async popup(data: DialogData) {
    return this.dialog.open(PopupComponent, { data: data })
  }
  
  public async errorPopup(msg: string, content: string[] = []) {
    const data: DialogData = {
      header: msg,
      content: content,
      isError: true
    }
    return this.dialog.open(PopupComponent, { data: data })
  }

}
