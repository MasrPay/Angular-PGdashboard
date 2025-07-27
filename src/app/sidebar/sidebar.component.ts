import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  currentRoute = '';
  
  // Dropdown state for merchants only
  merchantsOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      // Auto-expand merchants dropdown based on current route
      this.updateDropdownStates();
    });
    
    // Set initial route
    this.currentRoute = this.router.url;
    this.updateDropdownStates();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDropdown(category: string) {
    if (category === 'merchants') {
      this.merchantsOpen = !this.merchantsOpen;
    }
  }

  toggleMerchants(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Toggle dropdown
    this.toggleDropdown('merchants');
    
    // Also navigate to merchants main page
    this.router.navigate(['/merchants']);
  }

  updateDropdownStates() {
    // Auto-expand merchants dropdown only when on subcategory routes
    this.merchantsOpen = this.currentRoute.includes('/merchants/') && this.currentRoute !== '/merchants';
  }

  isActive(route: string): boolean {
    if (route === '/dashboard' && (this.currentRoute === '/' || this.currentRoute === '/dashboard')) {
      return true;
    }
    if (route === '/merchants' && this.currentRoute === '/merchants') {
      return true; // Only highlight parent when exactly on /merchants
    }
    if (route === '/merchants/kyb' && this.currentRoute === '/merchants/kyb') {
      return true; // Only highlight KYB when exactly on /merchants/kyb
    }
    if (route === '/merchants/mail' && this.currentRoute === '/merchants/mail') {
      return true; // Only highlight Mail Content when exactly on /merchants/mail
    }
    if (route !== '/dashboard' && route !== '/merchants' && route !== '/merchants/kyb' && route !== '/merchants/mail' && this.currentRoute.startsWith(route)) {
      return true;
    }
    return false;
  }

  isParentActive(): boolean {
    return this.currentRoute === '/merchants';
  }

  isDropdownOpen(category: string): boolean {
    if (category === 'merchants') {
      return this.merchantsOpen;
    }
    return false;
  }
}