import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { loggedInChange } from '../../profile/profile.state';
import { LoginComponent } from '../../profile/auth/view/login/login.component';
import { ProfileComponent } from '../../profile/view/profile/profile.component';
import { BookFormComponent } from '../../booking/view/book-form/book-form.component';
import { ArtistFormComponent } from '../../artist/view/artist-form/artist-form.component';
import { NotFoundPageComponent } from '../view/error/not-found-page/not-found-page.component';
import { ArtistsViewComponent } from '../../artist/view/artists-view/artists-view.component';
import { AppState } from '../../app.state';

export interface MenuButtonItem {
  label: string
  onclick(): void
  active?: boolean
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
    this.store.select(loggedInChange)
    // .pipe(skip(1))
    .subscribe(loggedIn => {
      if (loggedIn) {
        this.menuButtonsSubject$.next([...this._menuButtons, {
          label: 'Profie',
          onclick: () => this.to(ProfileComponent.path)
        }])
      } else {
        this.menuButtonsSubject$.next([...this._menuButtons, {
          label: 'Login',
          onclick: () => this.to(LoginComponent.path)
        }])
        // this.home()
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

}
