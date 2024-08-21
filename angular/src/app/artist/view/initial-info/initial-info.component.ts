import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../global/controls/input/input.component';
import { SelectorComponent, SelectorItem } from '../../../global/controls/selector/selector.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { ProfileService } from '../../../profile/profile.service';
import { map, Observable, shareReplay, take, tap } from 'rxjs';
import { FormVal } from '../../../global/utils/form-val';
import { login, } from '../../../profile/profile.state';
import { ArtistService } from '../../artist.service';
import { BtnComponent } from '../../../global/controls/btn/btn.component';
import { FormUtil } from '../../../global/utils/form.util';
import { CourtineService } from '../../../global/nav/courtine.service';
import { DialogService } from '../../../global/nav/dialog.service';
import { initializedArtist } from '../artist-view/artist-view.state';

@Component({
  selector: 'app-initial-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SelectorComponent,
    BtnComponent,
  ],
  templateUrl: './initial-info.component.html',
  styleUrl: './initial-info.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InitialInfoComponent {

  constructor(
    private readonly store: Store<AppState>,
    private readonly profileService: ProfileService,
    private readonly artistService: ArtistService,
    private readonly dialog: DialogService,
    private readonly courtine: CourtineService,
  ) {}

  form = new FormGroup({
    manager: new FormControl('', Validators.required),
    artistName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [Validators.required, FormVal.phoneValidator]),
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  _autoselectManagerUid?: string

  _managerItems$: Observable<SelectorItem[]> = this.profileService.fetchManagers$().pipe(
    shareReplay(1),
    take(1),
    map(profiles => profiles.map(p => ({ 
      code: p.uid,
      name: p.name
    }))),
    tap(items => {
      if (items.length === 1) {
        setTimeout(() => {
          this._autoselectManagerUid = items[0].code
        }, 100)
      }
    }),
  )

  ngOnInit(): void {
    this.profileService.fetchFullProfile$().pipe(
      take(1),
      tap(profile => {
        this.form.controls.artistName.setValue(profile?.name!)
        if (profile?.phoneNumber) {
          this.form.controls.phoneNumber.setValue(profile?.phoneNumber)
        }
        const email = profile.contactEmail || profile.email
        if (email) {
          this.form.controls.email.setValue(email)
        }
      })
    ).subscribe()
  }

  _submit() {
    if (this.form.invalid) {
      FormUtil.markForm(this.form)
      return
    }
    this.courtine.startCourtine()
    this.artistService.createArtist$(this.form.value).pipe(
      take(1),
      tap(artist => this.store.dispatch(initializedArtist(artist))),
      tap(() => this.store.dispatch(login())),
    ).subscribe({
      next: (artist) => {
        this.courtine.stopCourtine()
        window.location.reload()
      },
      error: (error) => {
        this.dialog.errorPopup(error.error.message)
      }
    })
  }

}
