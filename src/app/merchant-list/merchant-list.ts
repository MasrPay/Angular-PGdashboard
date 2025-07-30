import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { GetService } from '../get.service';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-merchant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './merchant-list.html',
  styleUrls: ['./merchant-list.css']
})
export class MerchantListComponent implements OnInit {
  merchants: any[] = [];
  errorMsg: string = '';
  selectedStatus: string = '';
  constructor(
    private getService: GetService, 
    private router: Router,
    private layoutService: LayoutService
  ) {}

  ngOnInit(): void {
    this.layoutService.showNavbarFn();
    const savedStatus = localStorage.getItem('merchantFilterStatus');
    if (savedStatus) {
      this.selectedStatus = savedStatus;
    }
    const cachedMerchants = localStorage.getItem('merchantListCache');
    if (cachedMerchants) {
      this.merchants = JSON.parse(cachedMerchants);
    }
    this.loadMerchants();
  }

  loadMerchants() {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/']);
      return;
    }
    this.getService.getAllMerchants(token, this.selectedStatus).subscribe({
      next: (res: any) => {
        console.log('API response:', res);
        if (res.status === 200 && res.data) {
          this.merchants = res.data;
          localStorage.setItem('merchantListCache', JSON.stringify(res.data));
        } else {
          this.merchants = [];
          this.errorMsg = res.message || 'No merchants found.';
        }
      },
      error: (err: any) => {
        this.merchants = [];
        this.errorMsg = 'Failed to fetch merchants.';
      }
    });
  }

  onStatusFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedStatus = select.value;
    localStorage.setItem('merchantFilterStatus', this.selectedStatus);
    this.loadMerchants();
  }
}
