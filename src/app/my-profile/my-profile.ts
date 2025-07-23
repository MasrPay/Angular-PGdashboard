import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetService } from '../get.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.css']
})
export class MyProfileComponent implements OnInit {
  profile: any = null;
  errorMsg: string = '';

  constructor(private getService: GetService, private router: Router) {}

  ngOnInit(): void {
    const cachedProfile = localStorage.getItem('userProfile');
    if (cachedProfile) {
      this.profile = JSON.parse(cachedProfile);
      return;
    }
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/']);
      return;
    }
    this.getService.getProfile(token).subscribe({
      next: (res: any) => {
        if (res.status === 200 && res.data) {
          this.profile = res.data;
          localStorage.setItem('userProfile', JSON.stringify(res.data));
        } else {
          this.errorMsg = res.message || 'Failed to fetch profile.';
        }
      },
      error: (err: any) => {
        this.errorMsg = 'Server error fetching profile.';
      }
    });
  }
}
