import { Component } from '@angular/core';
import { LoginComponent } from './login/login';

@Component({
  selector: 'app-root',
  imports: [LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = 'admin_dashboard';
}
  