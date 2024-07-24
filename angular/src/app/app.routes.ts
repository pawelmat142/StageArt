import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { NotFoundPageComponent } from './pages/error/not-found-page/not-found-page.component';
import { AddArtistComponent } from './pages/admin/pages/add-artist/add-artist.component';

export const routes: Routes = [
    {
        path: '', 
        component: HomepageComponent
    }, {
        // TODO only admin 
        path: 'add-artist',
        component: AddArtistComponent,
    }, {
        path: '**',
        component: NotFoundPageComponent,
    },
];
