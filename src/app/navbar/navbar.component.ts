import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() isSidebarCollapsed = false;
  
  userName = 'User Name';
  showUserDropdown = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.showUserDropdown = false;
    }
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  onSettingsClick() {
    console.log('Settings clicked');
    // Add settings functionality
  }

  onNotificationsClick() {
    console.log('Notifications clicked');
    // Add notifications functionality
  }

  onLogout() {
    console.log('Logout clicked');
    // Add logout functionality
  }
} 