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
      next: (res) => {
        this.isLoading = false;
        if (res.status === 200) {
          this.successMsg = 'Code verified successfully! You may now reset your password.';
          // Optionally redirect to reset password page
        } else {
          this.errorMsg = res.message || 'Invalid code. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Server error. Please try again.';
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