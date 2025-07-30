import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { MerchantListComponent } from './merchant-list/merchant-list';
import { CreateUserComponent } from './create-user/create-user';
import { MyProfileComponent } from './my-profile/my-profile';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';
import { VerifyCodeComponent } from './verify-code/verify-code';
import { ResetPasswordComponent } from './reset-password/reset-password';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-code', component: VerifyCodeComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'dashboard', component: LoginComponent }, // Using LoginComponent as placeholder for dashboard
  { path: 'gateway', component: LoginComponent },
  
  // Merchants routes
  { path: 'merchants', component: MerchantListComponent },
  { path: 'merchants/create', component: CreateUserComponent },
  { path: 'merchants/kyb', component: LoginComponent },
  { path: 'merchants/mail', component: LoginComponent },
  
  { path: 'payments', component: LoginComponent },
  { path: 'withdrawal', component: LoginComponent },
  { path: 'users', component: LoginComponent },
  { path: 'support', component: LoginComponent },
  { path: 'roles', component: LoginComponent },
  { path: 'profile', component: MyProfileComponent },
  { path: 'reports', component: LoginComponent },
  { path: 'site', component: LoginComponent },
  { path: 'frontend', component: LoginComponent },
  { path: 'communication', component: LoginComponent }
];
