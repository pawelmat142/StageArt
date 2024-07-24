import { Component } from '@angular/core';
import { LogoComponent } from '../components/logo/logo.component';
import { HomepageFormComponent } from './homepage-form/homepage-form.component';
import { MenuButtonComponent } from '../components/menu-button/menu-button.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    LogoComponent,
    HomepageFormComponent,
    MenuButtonComponent,
    HeaderComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
  