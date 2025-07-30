import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-password-changed',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './password-changed.html',
  styleUrls: ['./password-changed.css']
})
export class PasswordChangedComponent implements OnInit, OnDestroy {
  // Modal states
  showTermsModal = false;
  showSupportModal = false;

  constructor(
    private router: Router,
    private layoutService: LayoutService
  ) {}

  ngOnInit() {
    this.layoutService.hideSidebar();
    this.layoutService.hideNavbar();
  }

  ngOnDestroy() {
    this.layoutService.showSidebarFn();
    this.layoutService.showNavbarFn();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  openTermsModal() {
    this.showTermsModal = true;
  }
  
  openSupportModal() {
    this.showSupportModal = true;
  }
  
  closeTermsModal() {
    this.showTermsModal = false;
  }
  
  closeSupportModal() {
    this.showSupportModal = false;
  }
  
  getTermsContent(): string {
    return `TERMS AND CONDITIONS\n\n1. ACCEPTANCE OF TERMS\nBy accessing and using the MasrPay platform, you agree to be bound by these Terms and Conditions.\n...`;
  }
  
  getSupportContent(): string {
    return `MASRPAY SUPPORT\n\nWelcome to MasrPay Support! We're here to help you with any questions or issues you may have.\n...`;
  }
} 