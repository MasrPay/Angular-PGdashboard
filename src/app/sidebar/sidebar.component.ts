import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
    sidebarOpen = true;
    merchantsOpen = false; // Added for merchants dropdown toggle
    usersOpen = false; // Added for users dropdown toggle
    settingsOpen = false; // Added for settings dropdown toggle
    reportsOpen = false; // Added for reports dropdown toggle
    transactionsOpen = false; // Added for transactions dropdown toggle
}