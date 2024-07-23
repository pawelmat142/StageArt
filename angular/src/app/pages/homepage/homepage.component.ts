import { Component } from '@angular/core';
import { LogoComponent } from '../components/logo/logo.component';
import { HomepageFormComponent } from './homepage-form/homepage-form.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    LogoComponent,
    HomepageFormComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
  