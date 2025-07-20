import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../post'; // adjust path if needed


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  captchaImage: string = '';
  captchaKey: string = '';
  captchaSecret: string = '';
  showPassword: boolean = false;

  @ViewChild('captchaCanvas', { static: true }) captchaCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private zone: NgZone // Inject NgZone
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCaptcha();
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

    console.log('Login payload:', payload); // Debug log

    this.postService.login(payload).subscribe({
      next: (res) => {
        if (res.status === 200 && res.data?.access_token) {
          sessionStorage.setItem('access_token', res.data.access_token);
          // TODO: Redirect to dashboard or another page after login
          alert('Login successful!');
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
}
