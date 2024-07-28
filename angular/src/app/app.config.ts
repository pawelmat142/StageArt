import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CountriesService, initCountries } from './services/countries/countries.service';

registerLocaleData(localeEn);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideAnimationsAsync(),

    {
      provide: LOCALE_ID,
      useValue: 'en-EN'
    }, 
    {
      provide: APP_INITIALIZER,
      useFactory: initCountries,
      deps: [CountriesService],
      multi: true
    }
  ]
};
