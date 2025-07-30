import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';
import { FirstTimeService, FirstTimeStatus } from '../first-time.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-first-time-flow',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <div class="first-time-overlay" *ngIf="showOverlay">
      <div class="first-time-modal">
        <div class="text-center mb-4">
          <h3>Welcome to MasrPay!</h3>
          <p class="text-muted">Please complete the setup to continue.</p>
        </div>
        
        <div class="progress mb-4">
          <div class="progress-bar" [style.width.%]="progressPercentage"></div>
        </div>
        
        <div class="step-indicator">
          <span class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">1</span>
          <span class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">2</span>
        </div>
        
        <div class="step-content">
          <div *ngIf="currentStep === 1" class="text-center">
            <h4>Terms & Conditions</h4>
            <p>Please review and accept our terms and conditions to continue.</p>
            <button class="btn btn-primary" (click)="showTermsModal = true">
              Review Terms
            </button>
          </div>
          
          <div *ngIf="currentStep === 2" class="text-center">
            <h4>Security Setup</h4>
            <p>Please change your password for security.</p>
            <button class="btn btn-primary" (click)="goToPasswordChange()">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <app-modal 
      [isOpen]="showTermsModal" 
      title="Terms & Conditions" 
      [content]="getTermsContent()"
      [showAcceptButton]="true"
      (closeModal)="closeTermsModal()"
      (acceptModal)="acceptTerms()">
    </app-modal>
  `,
  styleUrls: ['./first-time-flow.css']
})
export class FirstTimeFlowComponent implements OnInit, OnDestroy {
  showOverlay = false;
  showTermsModal = false;
  currentStep = 1;
  progressPercentage = 50;
  firstTimeStatus: FirstTimeStatus | null = null;
  isInPasswordChangeFlow = false;

  constructor(
    private firstTimeService: FirstTimeService,
    private router: Router,
    private layoutService: LayoutService
  ) {}

  ngOnInit() {
    // Listen to route changes to re-check first-time status
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Only show overlay on dashboard route, not on password change page
      if (event.url === '/dashboard' && !this.isInPasswordChangeFlow) {
        this.checkFirstTimeStatus();
      } else if (event.url === '/first-time-password') {
        // Hide overlay on password change page and don't re-check
        this.showOverlay = false;
        this.isInPasswordChangeFlow = true;
      } else {
        // Hide overlay on other routes
        this.showOverlay = false;
        this.isInPasswordChangeFlow = false; // Reset flag when leaving password flow
      }
    });
  }

  ngOnDestroy() {
    // Clean up if needed
  }

  checkFirstTimeStatus() {
    this.firstTimeService.checkFirstTimeStatus().subscribe(status => {
      console.log('First-time status check:', status);
      this.firstTimeStatus = status;
      if (status.isFirstTime) {
        console.log('Showing first-time overlay');
        this.showOverlay = true;
        this.updateStep();
      } else {
        console.log('Hiding first-time overlay - user completed flow');
        // User has completed first-time flow, hide overlay
        this.showOverlay = false;
      }
    });
  }

  updateStep() {
    if (this.firstTimeStatus) {
      if (this.firstTimeStatus.needsTermsAcceptance) {
        this.currentStep = 1;
        this.progressPercentage = 50;
      } else if (this.firstTimeStatus.needsPasswordChange) {
        this.currentStep = 2;
        this.progressPercentage = 100;
      }
    }
  }

  closeTermsModal() {
    this.showTermsModal = false;
  }

  acceptTerms() {
    this.firstTimeService.acceptTerms().subscribe({
      next: (res: any) => {
        console.log('Terms acceptance response:', res);
        if (res.status === 200 || res.success) {
          this.firstTimeService.markTermsAccepted();
          this.currentStep = 2;
          this.progressPercentage = 100;
          this.showTermsModal = false;
          // Don't hide overlay yet, let user see step 2
        } else {
          console.error('Terms acceptance failed:', res.message);
          alert('Failed to accept terms: ' + (res.message || 'Unknown error'));
        }
      },
      error: (err: any) => {
        console.error('Failed to accept terms:', err);
        const errorMessage = err.error?.message || err.message || 'Unknown error';
        
        // If terms are already accepted, treat it as success
        if (errorMessage.includes('already accepted')) {
          console.log('Terms already accepted, proceeding to next step');
          this.firstTimeService.markTermsAccepted();
          this.currentStep = 2;
          this.progressPercentage = 100;
          this.showTermsModal = false;
        } else {
          alert('Failed to accept terms. Please try again. Error: ' + errorMessage);
        }
      }
    });
  }

  goToPasswordChange() {
    this.showOverlay = false; // Hide the overlay when going to password change
    this.isInPasswordChangeFlow = true; // Set flag to prevent re-checking
    this.router.navigate(['/first-time-password']);
    // Don't re-check status when navigating to password change
  }

  getTermsContent(): string {
    return `TERMS AND CONDITIONS

1. ACCEPTANCE OF TERMS
By accessing and using the MasrPay platform, you agree to be bound by these Terms and Conditions.

2. USE OF SERVICE
You agree to use the service only for lawful purposes and in accordance with these Terms.

3. PRIVACY POLICY
Your privacy is important to us. Please review our Privacy Policy.

4. SECURITY
You are responsible for maintaining the confidentiality of your account credentials.

5. PROHIBITED ACTIVITIES
You agree not to engage in any activities that may harm the service or other users.

6. TERMINATION
We reserve the right to terminate or suspend your account at any time.

7. CHANGES TO TERMS
We may modify these terms at any time. Continued use constitutes acceptance.

8. CONTACT
For questions about these terms, please contact our support team.

By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.`;
  }
} 