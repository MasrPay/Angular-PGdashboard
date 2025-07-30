import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';
import { PostService } from '../post';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  captchaImage: string = '';
  captchaKey: string = '';
  captchaSecret: string = '';
  errorMsg: string | null = null;
  successMsg: string | null = null;
  isLoading = false;

  // Modal states
  showTermsModal = false;
  showSupportModal = false;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

  loadCaptcha() {
    this.postService.generateCaptcha().subscribe({
      next: (res) => {
        console.log('Captcha response:', res);
        this.captchaImage = res.data.captcha_image;
        this.captchaKey = res.data.captcha_key;
        this.captchaSecret = res.data.captcha_secret;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load captcha:', err);
        this.errorMsg = 'Failed to load CAPTCHA. Please try again.';
      }
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMsg = null;
    this.successMsg = null;

    const payload = {
      email: this.forgotPasswordForm.value.email,
      captcha_code: parseInt(this.forgotPasswordForm.value.captcha),
      captcha_secret: this.captchaSecret,
      captcha_key: this.captchaKey
    };

    this.postService.sendResetCode(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 200) {
          sessionStorage.setItem('verifyEmail', this.forgotPasswordForm.value.email);
          this.router.navigate(['/verify-code'], { state: { email: this.forgotPasswordForm.value.email } });
        } else {
          this.errorMsg = res.message || 'Failed to send reset code. Please try again.';
          this.loadCaptcha();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Server error. Please try again.';
        this.loadCaptcha();
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Modal methods
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

2. PASSWORD RESET
• Check your email spam folder
• Ensure you're using the correct email address
• Wait a few minutes for the email to arrive
• Contact support if you don't receive the reset code

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
} 