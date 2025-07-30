import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { PostService } from '../post';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.html',
  styleUrls: ['./create-user.css']
})
export class CreateUserComponent implements OnInit {
  createForm: FormGroup;
  message: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder, 
    private postService: PostService,
    private layoutService: LayoutService
  ) {
    this.createForm = this.fb.group({
      company_name: ['', [Validators.required, Validators.maxLength(255)]],
      contact_name: ['', [Validators.required, Validators.maxLength(255)]],
      user_name: ['', [Validators.required, Validators.maxLength(255)]],
      phone: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      city: ['', [Validators.required, Validators.maxLength(255)]],
      country: ['', [Validators.required, Validators.maxLength(255)]],
      postal_code: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\- ]{3,10}$/)]],
      page_link: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      modules: this.fb.array([], [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.layoutService.showNavbarFn();
  }

  get modules(): FormArray {
    return this.createForm.get('modules') as FormArray;
  }

  passwordMatchValidator(group: FormGroup): {[key: string]: any} | null {
    const password = group.get('password')?.value;
    const passwordConfirmation = group.get('password_confirmation')?.value;
    return password === passwordConfirmation ? null : { 'passwordMismatch': true };
  }

  onModuleChange(event: any, value: number) {
    if (event.target.checked) {
      this.modules.push(this.fb.control(value));
    } else {
      const idx = this.modules.controls.findIndex(ctrl => ctrl.value === value);
      if (idx !== -1) this.modules.removeAt(idx);
    }
  }

  onSubmit() {
    console.log('Submit clicked');
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const token = sessionStorage.getItem('access_token') || '';
    const payload = { ...this.createForm.value, modules: this.modules.value };
    console.log('Submitting payload:', payload);
    this.postService.createUser(payload, token).subscribe({
      next: (res: any) => {
        console.log('API response:', res);
        if (res.status === 201) {
          this.message = 'User created successfully!';
          this.error = '';
        } else {
          this.message = '';
          this.error = res.message || 'Failed to create user.';
        }
      },
      error: (err: any) => {
        this.message = '';
        this.error = 'Server error creating user.';
      }
    });
  }
}
