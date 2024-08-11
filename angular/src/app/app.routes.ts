import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { NotFoundPageComponent } from './pages/error/not-found-page/not-found-page.component';
import { ArtistFormComponent } from './pages/admin/pages/artist-form/artist-form.component';
import { ArtistViewComponent } from './pages/views/artist-view/artist-view.component';
import { ArtistsViewComponent } from './pages/views/artists-view/artists-view.component';
import { BookFormComponent } from './pages/views/book-form/book-form.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    {
        path: '', 
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
        path: `${ProfileComponent.path}/telegram/:id`,
        component: ProfileComponent,
    }, {
        path: ProfileComponent.path,
        component: ProfileComponent,
    }, {
        path: NotFoundPageComponent.path,
        component: NotFoundPageComponent
    }, {
        path: '**',
        component: NotFoundPageComponent,
    },
];
