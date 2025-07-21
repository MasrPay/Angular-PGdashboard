import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { MerchantListComponent } from './merchant-list/merchant-list';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'merchants', component: MerchantListComponent }
];
