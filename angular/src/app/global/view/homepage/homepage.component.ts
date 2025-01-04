import { Component } from '@angular/core';
import { LogoComponent } from '../../components/logo/logo.component';
import { HomepageFormComponent } from './homepage-form/homepage-form.component';
import { ArtistsSectionComponent } from './artists-section/artists-section.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MenuButtonComponent } from '../../components/menu-button/menu-button.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { $desktop } from '../../tools/media-query';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    LogoComponent,
    HomepageFormComponent,
    MenuButtonComponent,
    HeaderComponent,
    ArtistsSectionComponent,
    FeedbackComponent,
    CommonModule
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  readonly $desktop = $desktop

  public static readonly path = 'home'

}
  