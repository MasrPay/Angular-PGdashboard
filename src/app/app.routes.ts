import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { MerchantListComponent } from './merchant-list/merchant-list';
import { CreateUserComponent } from './create-user/create-user';
import { MyProfileComponent } from './my-profile/my-profile';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'merchants', component: MerchantListComponent },
  { path: 'merchants/create', component: CreateUserComponent },
  { path: 'profile', component: MyProfileComponent }
];
