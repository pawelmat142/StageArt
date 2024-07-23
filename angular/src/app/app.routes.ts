import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { NotFoundPageComponent } from './pages/error/not-found-page/not-found-page.component';

export const routes: Routes = [
    {
        path: '', 
        component: HomepageComponent
    }, {
        path: '**',
        component: NotFoundPageComponent,
    },
];
