import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GetService {
  private baseUrl = 'https://md-new.dev.ho.masrpay.com.eg/api';

  constructor(private http: HttpClient) {}

  getAllMerchants(token: string, status?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    let url = `${this.baseUrl}/admin/manage-user/all`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get(url, { headers });
  }
} 