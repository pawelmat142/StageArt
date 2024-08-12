import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, skip } from 'rxjs';
import { DialogData, PopupComponent } from '../../pages/components/popup/popup.component';
import { ArtistFormComponent } from '../../pages/admin/pages/artist-form/artist-form.component';
import { NotFoundPageComponent } from '../../pages/error/not-found-page/not-found-page.component';
import { ArtistsViewComponent } from '../../pages/views/artists-view/artists-view.component';
import { BookFormComponent } from '../../pages/views/book-form/book-form.component';
import { ProfileComponent } from '../../auth/profile/profile.component';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { loggedInChange } from '../../auth/profile.state';

export interface MenuButtonItem {
  label: string
  onclick(): void
}

@Injectable({
  providedIn: 'root'
})
export class NavService {

  private readonly _menuButtons: MenuButtonItem[] = [{
    label: 'Home',
    onclick: () => this.home()
  },{
    label: "Artists",
    onclick: () => this.to(ArtistsViewComponent.path)
  }, {
    label: "Book now",
    onclick: () => this.to(BookFormComponent.path)
  }, {
    label: "ADD",
    onclick: () => this.to(ArtistFormComponent.path)
  }]

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly store: Store<AppState>,
  ) {
    this.store.select(loggedInChange).pipe(skip(1)).subscribe(profile => {
      if (profile) {
        this.menuButtonsSubject$.next([...this._menuButtons, {
          label: 'Profie',
          onclick: () => this.to(ProfileComponent.path)
        }])
      } else {
        this.menuButtonsSubject$.next(this._menuButtons)
        this.home()
      }
    })
    
  }


  private menuButtonsSubject$ = new BehaviorSubject(this._menuButtons)

  get menuButtons$() {
    return this.menuButtonsSubject$.asObservable()
  }

  private menuButtonOverhiddenSubject$ = new BehaviorSubject(false)
  public get menuButtonOverhidden$() {
    return this.menuButtonOverhiddenSubject$.asObservable()
  }
  public set menuButtonOverhidden(isOnView: boolean) {
    this.menuButtonOverhiddenSubject$.next(isOnView)
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

  public toArtist(artistName: string) {
    return this.router.navigate(['artist', artistName])
  }


  public async simplePopup(header: string) {
    const data = { header }
    return this.popup(data)
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
