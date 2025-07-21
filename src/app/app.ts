import { Component } from '@angular/core';
import { MerchantListComponent } from './merchant-list/merchant-list';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = 'admin_dashboard';
}
  