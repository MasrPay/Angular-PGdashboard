import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('captchaCanvas', { static: true }) captchaCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['', Validators.required]
    });
    
  }

  ngOnInit() {
  this.loadCaptcha();
}

loadCaptcha() {
  this.postService.generateCaptcha().subscribe({
    next: (res) => {
      this.captchaImage = res.captcha_image;
      this.captchaKey = res.data.captcha_key;
      this.captchaSecret = res.data.captcha_secret;
    },
    error: (err) => {
      console.error('Failed to load captcha:', err);
    }
  });
}


  // ...existing code...

// drawCaptcha(text: string) {
//   const canvas = this.captchaCanvas.nativeElement;
//   const ctx = canvas.getContext('2d')!;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Add background noise (lines)
//   for (let i = 0; i < 5; i++) {
//     ctx.beginPath();
//     ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
//     ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
//     ctx.strokeStyle = `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},0.5)`;
//     ctx.lineWidth = 1 + Math.random() * 2;
//     ctx.stroke();
//   }

//   // Draw each character with random rotation and position
//   for (let i = 0; i < text.length; i++) {
//     const char = text[i];
//     const x = 15 + i * 16 + Math.random() * 4;
//     const y = 28 + Math.random() * 6;
//     const angle = (Math.random() - 0.5) * 0.6; // -0.3 to +0.3 radians
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.rotate(angle);
//     ctx.font = '24px Arial';
//     ctx.fillStyle = '#333';
//     ctx.fillText(char, 0, 0);
//     ctx.restore();
//   }

//   // Add random dots as noise
//   for (let i = 0; i < 30; i++) {
//     ctx.beginPath();
//     ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random(), 0, 2 * Math.PI);
//     ctx.fillStyle = `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},0.7)`;
//     ctx.fill(); // FIX: Added fill() to actually draw the dots
//   }
// }

// ...existing code...

  onSubmit() {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const captchaInput = this.loginForm.value.captcha;

  this.postService.verifyCaptcha({
    captcha_input: captchaInput,
    captcha_key: this.captchaKey,
    captcha_secret: this.captchaSecret
  }).subscribe({
    next: (res) => {
      if (res.success) {
        // Proceed with actual login
        console.log('Captcha verified successfully.');
      } else {
        alert('CAPTCHA invalid');
        this.loadCaptcha();
      }
    },
    error: () => {
      alert('Server error verifying CAPTCHA');
      this.loadCaptcha();
    }
  });
}}
