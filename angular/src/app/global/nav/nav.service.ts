import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NotFoundPageComponent } from '../view/error/not-found-page/not-found-page.component';
import { Location } from '@angular/common';
import { Profile } from '../../profile/profile.model';
import { HomepageComponent } from '../view/homepage/homepage.component';
import { MenuItem } from 'primeng/api';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { FormType, openForm } from '../../form-processor/form.state';
import { Path } from './path';

export interface MenuButtonItem extends MenuItem {
  rolesGuard?: string[] //undefined means its available for every role
  filter?: (profile?: Profile) => boolean
  path?: string 
}

export interface AppMenuItem extends MenuItem {
  rolesGuard?: string[] //undefined means its available for every role
}

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(
    private readonly router: Router,
    private readonly location: Location,
    private readonly store: Store<AppState>,
  ) {
  }

  private menuButtonOverhiddenSubject$ = new BehaviorSubject(false)
  public get menuButtonOverhidden$() {
    return this.menuButtonOverhiddenSubject$.asObservable()
  }
  public set menuButtonOverhidden(isOnView: boolean) {
    this.menuButtonOverhiddenSubject$.next(isOnView)
  }

  public home() {
    this.router.navigate([HomepageComponent.path], { replaceUrl: true })
  }

  public toNotFound() {
    this.router.navigate([NotFoundPageComponent.path], { replaceUrl: true })
  }

  public to(path: string) {
    this.router.navigateByUrl(path)
  }

  public bookNow() {
    this.store.dispatch(openForm({ formType: FormType.BOOKING }))
    this.to(Path.BOOK_FORM_VIEW)
  }


  public toArtists() {
    this.to(Path.ARTISTS_LIST_VIEW)
  }

  public toArtist(artistName: string) {
    return this.router.navigate(['artist', artistName])
  }

  public replaceUrl(url: string) {
    this.router.navigateByUrl(url)
  }

  public get isHome(): boolean {
    return this.location.path() === ''
  }

  public get path(): string {
    return this.location.path()
  }

  public back() {
    this.location.back()
  }

}
