import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';
import { FirstTimeService } from '../first-time.service';

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
  selector: 'app-first-time-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './first-time-password.html',
  styleUrls: ['./first-time-password.css']
})
export class FirstTimePasswordComponent implements OnInit, OnDestroy {
  passwordForm: FormGroup;
  errorMsg: string | null = null;
  successMsg: string | null = null;
  isLoading = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Password requirements
  passwordRequirements = {
    minLength: false,
    mixedCase: false,
    letters: false,
    numbers: false,
    symbols: false
  };

  constructor(
    private fb: FormBuilder,
    private firstTimeService: FirstTimeService,
    private router: Router,
    private layoutService: LayoutService
  ) {
    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      password: ['', [Validators.required, passwordValidator]],
      password_confirmation: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit() {
    this.layoutService.hideSidebar();
    this.layoutService.hideNavbar();
    
    // Listen to password changes for real-time validation
    this.passwordForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordRequirements(value || '');
    });
  }

  ngOnDestroy() {
    this.layoutService.showSidebarFn();
    this.layoutService.showNavbarFn();
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

  passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMsg = null;
    this.successMsg = null;
    
    const payload = {
      current_password: this.passwordForm.value.current_password,
      password: this.passwordForm.value.password,
      password_confirmation: this.passwordForm.value.password_confirmation
    };

    this.firstTimeService.changePassword(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.status === 200) {
          this.successMsg = 'Password changed successfully!';
          this.firstTimeService.markPasswordChanged();
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        } else {
          this.errorMsg = res.message || 'Failed to change password. Please try again.';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Failed to change password. Please try again.';
      }
    });
  }
} 