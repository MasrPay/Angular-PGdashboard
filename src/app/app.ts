import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { LayoutService } from './layout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Sidebar],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor(public layoutService: LayoutService) {}
}
  