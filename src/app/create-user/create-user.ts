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
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      user_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postal_code: ['', Validators.required],
      country_code: ['', Validators.required],
      page_link: ['', Validators.required],
      modules: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.layoutService.showNavbarFn();
  }

  get modules(): FormArray {
    return this.createForm.get('modules') as FormArray;
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
