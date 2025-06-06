import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgApexchartsModule } from 'ng-apexcharts';

import { routes } from './app.routes';
import {  HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authInterceptor } from './auth.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
      HttpClientModule, 
       BrowserAnimationsModule,
    ToastrModule.forRoot(),
     NgApexchartsModule   
  )]
};
