import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LayoutService } from './layout.service';
import { CommonModule } from '@angular/common';
import { FirstTimeFlowComponent } from './first-time-flow/first-time-flow';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent, FirstTimeFlowComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class App {
  sidebarCollapsed = false;

  constructor(public layoutService: LayoutService) {}

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
  