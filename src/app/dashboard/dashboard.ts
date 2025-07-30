import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>Welcome to MasrPay Dashboard</h1>
        <p>Manage your merchants and payments from here.</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Merchants</h3>
          <p class="stat-number">0</p>
        </div>
        <div class="stat-card">
          <h3>Active Payments</h3>
          <p class="stat-number">0</p>
        </div>
        <div class="stat-card">
          <h3>Total Revenue</h3>
          <p class="stat-number">$0</p>
        </div>
        <div class="stat-card">
          <h3>Pending Withdrawals</h3>
          <p class="stat-number">0</p>
        </div>
      </div>
      
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button class="btn btn-primary">Add New Merchant</button>
          <button class="btn btn-secondary">View Reports</button>
          <button class="btn btn-secondary">Manage Users</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.layoutService.showSidebarFn();
    this.layoutService.showNavbarFn();
  }

  ngOnDestroy() {
    // Clean up if needed
  }
} 