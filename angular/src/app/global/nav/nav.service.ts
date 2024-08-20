import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NotFoundPageComponent } from '../view/error/not-found-page/not-found-page.component';
import { Location } from '@angular/common';
import { Profile } from '../../profile/profile.model';
import { HomepageComponent } from '../view/homepage/homepage.component';

export interface MenuButtonItem {
  label: string
  onclick?: () => void,
  path?: string,
  active?: boolean
  rolesGuard?: string[] //undefined means its available for every role
  filter?: (profile?: Profile) => boolean
}

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor(
    private readonly router: Router,
    private readonly location: Location,
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

  public toArtist(artistName: string) {
    return this.router.navigate(['artist', artistName])
  }

  public replaceUrl(url: string) {
    this.router.navigateByUrl(url)
  }

  public get isHome(): boolean {
    return this.location.path() === ''
  }

}
