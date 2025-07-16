import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  captchaImage = '';
  captchaKey = '';
  captchaSecret = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private postService: PostService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const captchaData = this.route.snapshot.data['captchaData'];

    if (captchaData && captchaData.data) {
      this.captchaImage = 'data:image/png;base64,' + captchaData.data.base64;
      this.captchaKey = captchaData.data.captcha_key;
      this.captchaSecret = captchaData.data.captcha_secret;
    } else {
      // fallback: load captcha manually if resolver failed
      this.loadCaptcha();
    }
  }

  loadCaptcha(): void {
    this.postService.generateCaptcha().subscribe({
      next: (res) => {
        this.captchaImage = 'data:image/png;base64,' + res.data.base64;
        this.captchaKey = res.data.captcha_key;
        this.captchaSecret = res.data.captcha_secret;
      },
      error: (err) => {
        console.error('Failed to load captcha:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.postService.verifyCaptcha({
      captcha_input: this.loginForm.value.captcha,
      captcha_key: this.captchaKey,
      captcha_secret: this.captchaSecret
    }).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Captcha verified! Proceeding with login...');
          // Your login logic here
        } else {
          alert('Captcha invalid, please try again.');
          this.loadCaptcha();
        }
      },
      error: () => {
        alert('Server error verifying captcha.');
        this.loadCaptcha();
      }
    });
  }
}
