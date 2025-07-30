import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../post';
import { Router } from '@angular/router';
import { LayoutService } from '../layout.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { FirstTimeService } from '../first-time.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  captchaImage: string = '';
  captchaKey: string = '';
  captchaSecret: string = '';
  showPassword: boolean = false;

  // Modal states - NEW ADDITION
  showTermsModal = false;
  showSupportModal = false;

 // @ViewChild('captchaCanvas', { static: true }) captchaCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private zone: NgZone, // Inject NgZone
    private router: Router,
    private layoutService: LayoutService,
    private firstTimeService: FirstTimeService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.layoutService.hideSidebar();
    this.layoutService.hideNavbar();
    this.loadCaptcha();
  }

  ngOnDestroy() {
    this.layoutService.showSidebarFn();
    this.layoutService.showNavbarFn();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loadCaptcha() {
    this.postService.generateCaptcha().subscribe({
      next: (res) => {
        console.log('Full captcha response:', res);
        this.captchaImage = res.data.captcha_image;
        this.captchaKey = res.data.captcha_key;
        this.captchaSecret = res.data.captcha_secret;
        console.log('captchaImage:', this.captchaImage);
        console.log('captchaKey:', this.captchaKey);
        console.log('captchaSecret:', this.captchaSecret);
        this.cdr.detectChanges(); // Force Angular to check for updates
      },
      error: (err) => {
        console.error('Failed to load captcha:', err);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload = {
      user_name: this.loginForm.value.username,
      password: this.loginForm.value.password,
      captcha_code: parseInt(this.loginForm.value.captcha), // Convert to number like Postman
      captcha_secret: this.captchaSecret,
      captcha_key: this.captchaKey
    };

   // console.log('Login payload:', payload); // Debug log

    this.postService.login(payload).subscribe({
      next: (res) => {
        if (res.status === 200 && res.data?.access_token) {
          sessionStorage.setItem('access_token', res.data.access_token);
          
          // Check backend status and set local flags accordingly
          this.firstTimeService.checkBackendTermsStatus().subscribe({
            next: () => {
              // Terms not accepted yet, clear flags
              sessionStorage.removeItem('terms_accepted');
              sessionStorage.removeItem('password_changed');
              this.checkFirstTimeStatusAndNavigate();
            },
            error: (err) => {
              // Terms already accepted, set the flag
              if (err.error?.message?.includes('already accepted')) {
                sessionStorage.setItem('terms_accepted', 'true');
                this.checkFirstTimeStatusAndNavigate();
              } else {
                // Other error, clear flags and proceed
                sessionStorage.removeItem('terms_accepted');
                sessionStorage.removeItem('password_changed');
                this.checkFirstTimeStatusAndNavigate();
              }
            }
          });
        } else {
          alert('Login failed: ' + (res.message || 'Unknown error'));
          this.loadCaptcha();
        }
      },
      error: (err) => {
        console.error('Login error:', err); // Debug log
        alert('Server error during login');
        this.loadCaptcha();
      }
    });
  }

  // NEW MODAL METHODS - ADDED WITHOUT REMOVING EXISTING CODE
  openTermsModal() {
    console.log('openTermsModal called');
    this.showTermsModal = true;
  }

  openSupportModal() {
    console.log('openSupportModal called');
    this.showSupportModal = true;
  }

  closeTermsModal() {
    console.log('closeTermsModal called');
    this.showTermsModal = false;
  }

  closeSupportModal() {
    console.log('closeSupportModal called');
    this.showSupportModal = false;
  }

  getTermsContent(): string {
    return `TERMS AND CONDITIONS

1. ACCEPTANCE OF TERMS
By accessing and using the MasrPay platform, you agree to be bound by these Terms and Conditions.

2. DEFINITIONS
"Service" refers to the MasrPay payment processing platform.
"User" refers to any individual or entity using the Service.
"Merchant" refers to businesses using the Service for payment processing.

3. USE OF SERVICE
3.1 You must be at least 18 years old to use the Service.
3.2 You are responsible for maintaining the confidentiality of your account.
3.3 You agree not to use the Service for any illegal or unauthorized purpose.

4. PAYMENT PROCESSING
4.1 MasrPay processes payments on behalf of merchants.
4.2 All transactions are subject to applicable fees and charges.
4.3 Refunds are processed according to merchant policies.

5. PRIVACY AND SECURITY
5.1 Your personal information is protected under our Privacy Policy.
5.2 We implement industry-standard security measures.
5.3 You are responsible for securing your account credentials.

6. LIMITATION OF LIABILITY
6.1 MasrPay is not liable for indirect, incidental, or consequential damages.
6.2 Our liability is limited to the amount paid for the Service.

7. TERMINATION
7.1 We may terminate your access to the Service at any time.
7.2 You may terminate your account by contacting support.

8. GOVERNING LAW
These terms are governed by the laws of Egypt.

9. CHANGES TO TERMS
We may update these terms from time to time. Continued use constitutes acceptance.

10. CONTACT INFORMATION
For questions about these terms, contact us at support@masrpay.com.

Last updated: January 2025`;
  }

  getSupportContent(): string {
    return `MASRPAY SUPPORT

Welcome to MasrPay Support! We're here to help you with any questions or issues you may have.

CONTACT METHODS:
• Email: support@masrpay.com
• Phone: +20 123 456 7890
• Live Chat: Available on our website
• Business Hours: Sunday-Thursday, 9 AM - 6 PM (Cairo Time)

COMMON ISSUES:

1. LOGIN PROBLEMS
• Ensure your username and password are correct
• Check that CAPTCHA is entered properly
• Clear browser cache and cookies
• Try using a different browser

2. PAYMENT ISSUES
• Verify your payment information
• Check your bank account balance
• Contact your bank if transactions are declined
• Ensure you're using a supported payment method

3. ACCOUNT ACCESS
• Reset your password if forgotten
• Contact support for account recovery
• Verify your email address is correct

4. TECHNICAL SUPPORT
• Check your internet connection
• Update your browser to the latest version
• Disable browser extensions that might interfere
• Try accessing from a different device

SECURITY TIPS:
• Never share your login credentials
• Use strong, unique passwords
• Enable two-factor authentication if available
• Log out when using shared computers
• Report suspicious activity immediately

For urgent issues, please call our support line during business hours.

Thank you for choosing MasrPay!`;
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  private checkFirstTimeStatusAndNavigate() {
    this.firstTimeService.checkFirstTimeStatus().subscribe(status => {
      console.log('Login - First-time status:', status);
      if (status.isFirstTime) {
        console.log('Login - Redirecting new user to dashboard');
        // Navigate to dashboard where first-time flow will be triggered
        this.router.navigate(['/dashboard']);
      } else {
        console.log('Login - Redirecting existing user to merchants');
        // Regular user, go to merchants
        this.router.navigate(['/merchants']);
      }
    });
  }
}
