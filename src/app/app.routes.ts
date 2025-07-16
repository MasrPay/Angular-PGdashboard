// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { CaptchaResolver } from './resolvers/captcha-resolver.service';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: {
      captchaData: CaptchaResolver
    }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
