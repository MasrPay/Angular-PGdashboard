import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';
import { PostService } from '../post';
import { ModalComponent } from '../shared/modal/modal.component';

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const errors: any = {};
  if (value.length < 15) errors.minLength = true;
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value)) errors.mixedCase = true;
  if (!/[a-zA-Z]/.test(value)) errors.letters = true;
  if (!/\d/.test(value)) errors.numbers = true;
  if (!/[^a-zA-Z0-9]/.test(value)) errors.symbols = true;
  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  isLoading = false;
  emailPrefilled = false;
  tokenPrefilled = false;
  showPassword = false;
  showConfirmPassword = false;

  // Password requirements
  passwordRequirements = {
    minLength: false,
    mixedCase: false,
    letters: false,
    numbers: false,
    symbols: false
  };

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
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      token: ['', Validators.required],
      password: ['', [Validators.required, passwordValidator]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit() {
    this.layoutService.hideSidebar();
    this.layoutService.hideNavbar();
    let email = '';
    let token = '';
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && nav.extras.state) {
      if (nav.extras.state['email']) {
        email = nav.extras.state['email'];
        this.emailPrefilled = true;
      }
      if (nav.extras.state['token']) {
        token = nav.extras.state['token'];
        this.tokenPrefilled = true;
      }
    } else {
      email = sessionStorage.getItem('verifyEmail') || '';
      token = sessionStorage.getItem('verifyToken') || '';
      if (email) this.emailPrefilled = true;
      if (token) this.tokenPrefilled = true;
    }
    if (email) this.resetPasswordForm.patchValue({ email });
    if (token) this.resetPasswordForm.patchValue({ token });
    
    // Listen to password changes for real-time validation
    this.resetPasswordForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordRequirements(value || '');
    });
    
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.layoutService.showSidebarFn();
    this.layoutService.showNavbarFn();
  }

  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = null;
    this.successMsg = null;
    const payload = {
      email: this.resetPasswordForm.value.email,
      token: this.resetPasswordForm.value.token,
      password: this.resetPasswordForm.value.password,
      password_confirmation: this.resetPasswordForm.value.password_confirmation
    };
    this.postService.resetPassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 200) {
          this.successMsg = 'Password reset successfully! You may now log in.';
          sessionStorage.removeItem('verifyEmail');
          sessionStorage.removeItem('verifyToken');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMsg = res.message || 'Failed to reset password. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'Server error. Please try again.';
      }
    });
  }

  checkPasswordRequirements(password: string) {
    this.passwordRequirements = {
      minLength: password.length >= 15,
      mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
      letters: /[a-zA-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^a-zA-Z0-9]/.test(password)
    };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  openTermsModal() { this.showTermsModal = true; }
  openSupportModal() { this.showSupportModal = true; }
  closeTermsModal() { this.showTermsModal = false; }
  closeSupportModal() { this.showSupportModal = false; }
  getTermsContent(): string { return `TERMS AND CONDITIONS\n...`; }
  getSupportContent(): string { return `MASRPAY SUPPORT\n...`; }
} 