import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { profile } from '../../../profile/profile.state';

@Component({
  selector: 'app-profile-data',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.scss'
})
export class ProfileDataComponent {
  
  constructor(
    private readonly store: Store<AppState>
  ) {}

  _profile$ = this.store.select(profile)

}
