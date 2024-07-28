import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { NotFoundPageComponent } from './pages/error/not-found-page/not-found-page.component';
import { ArtistFormComponent } from './pages/admin/pages/artist-form/artist-form.component';
import { ArtistViewComponent } from './pages/views/artist-view/artist-view.component';

export const routes: Routes = [
    {
        path: '', 
        component: HomepageComponent
    }, {
        path: ArtistViewComponent.path,
        component: ArtistViewComponent,
    }, {
        path: ArtistFormComponent.path,
        component: ArtistFormComponent,
    }, {
        path: NotFoundPageComponent.path,
        component: NotFoundPageComponent
    }, {
        path: '**',
        component: NotFoundPageComponent,
    },
];
