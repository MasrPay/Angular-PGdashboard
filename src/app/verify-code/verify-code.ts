import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';
import { PostService } from '../post';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './verify-code.html',
  styleUrls: ['./verify-code.css']
})
export class VerifyCodeComponent implements OnInit, OnDestroy {
  verifyCodeForm: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  isLoading = false;
  isResending = false;
  emailPrefilled = false;

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
    this.verifyCodeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.layoutService.hideSidebar();
    this.layoutService.hideNavbar();
    let email = '';
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && nav.extras.state && nav.extras.state['email']) {
      email = nav.extras.state['email'];
    } else {
      email = sessionStorage.getItem('verifyEmail') || '';
    }
    if (email) {
      this.verifyCodeForm.patchValue({ email });
      this.emailPrefilled = true;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.layoutService.showSidebarFn();
    this.layoutService.showNavbarFn();
  }

  onSubmit() {
    if (this.verifyCodeForm.invalid) {
      this.verifyCodeForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = null;
    this.successMsg = null;
    const payload = {
      email: this.verifyCodeForm.value.email,
      token: this.verifyCodeForm.value.token
    };
    this.postService.verifyCode(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status === 200) {
          this.successMsg = 'Code verified successfully! Redirecting to password reset...';
          // Store email and token for reset password page
          sessionStorage.setItem('verifyEmail', this.verifyCodeForm.value.email);
          sessionStorage.setItem('verifyToken', this.verifyCodeForm.value.token);
          // Redirect to reset password page after a short delay
          setTimeout(() => {
            this.router.navigate(['/reset-password'], {
              state: {
                email: this.verifyCodeForm.value.email,
                token: this.verifyCodeForm.value.token
              }
            });
          }, 1500);
        } else {
          this.errorMsg = res.message || 'Invalid code. Please try again.';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Invalid code. Please try again.';
      }
    });
  }

  resendCode() {
    if (!this.verifyCodeForm.value.email) {
      this.errorMsg = 'Please enter your email address first.';
      return;
    }
    this.isResending = true;
    this.errorMsg = null;
    this.successMsg = null;
    
    // Generate new captcha first
    this.postService.generateCaptcha().subscribe({
      next: (captchaRes: any) => {
        const payload = {
          email: this.verifyCodeForm.value.email,
          captcha_code: captchaRes.captcha_code,
          captcha_secret: captchaRes.captcha_secret,
          captcha_key: captchaRes.captcha_key
        };
        this.postService.sendResetCode(payload).subscribe({
          next: (res: any) => {
            this.isResending = false;
            if (res.status === 200) {
              this.successMsg = 'Reset code sent successfully! Please check your email.';
            } else {
              this.errorMsg = res.message || 'Failed to send reset code. Please try again.';
            }
          },
          error: (err: any) => {
            this.isResending = false;
            this.errorMsg = err.error?.message || 'Failed to send reset code. Please try again.';
          }
        });
      },
      error: (err: any) => {
        this.isResending = false;
        this.errorMsg = 'Failed to generate captcha. Please try again.';
      }
    });
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