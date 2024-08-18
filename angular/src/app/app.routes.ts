import { Routes } from '@angular/router';
import { HomepageComponent } from './global/view/homepage/homepage.component';
import { NotFoundPageComponent } from './global/view/error/not-found-page/not-found-page.component';
import { RegisterComponent } from './profile/auth/view/register/register.component';
import { LoginComponent } from './profile/auth/view/login/login.component';
import { PanelComponent } from './profile/view/panel/panel.component';
import { BookFormComponent } from './booking/view/book-form/book-form.component';
import { ArtistFormComponent } from './artist/view/artist-form/artist-form.component';
import { ArtistViewComponent } from './artist/view/artist-view/artist-view.component';
import { ArtistsViewComponent } from './artist/view/artists-view/artists-view.component';

export const routes: Routes = [
    {
        path: HomepageComponent.path, 
        component: HomepageComponent
    }, {
        path: ArtistViewComponent.path,
        component: ArtistViewComponent,
    }, {
        path: ArtistsViewComponent.path,
        component: ArtistsViewComponent
    }, {
        path: BookFormComponent.path,
        component: BookFormComponent,
    }, {
        path: ArtistFormComponent.path,
        component: ArtistFormComponent,
    }, {
        path: LoginComponent.path,
        component: LoginComponent,
    }, {
        path: RegisterComponent.path,
        component: RegisterComponent
    }, {
        path: `${PanelComponent.path}/telegram/:id`,
        component: PanelComponent,
    }, {
        path: PanelComponent.path,
        component: PanelComponent,
    }, {
        path: NotFoundPageComponent.path,
        component: NotFoundPageComponent
    }, {
        path: '**',
        component: NotFoundPageComponent,
    },
];
