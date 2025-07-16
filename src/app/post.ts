import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  private baseUrl = 'https://md-new.dev.ho.masrpay.com.eg/api/Capatcha/Generate'; // 🌐 Replace with your backend base URL

  constructor(private http: HttpClient) {}

  generateCaptcha(): Observable<any> {
    return this.http.post(`${this.baseUrl}/Capatcha/Generate`, {});
  }

  // If there's a verify endpoint like `/Capatcha/Verify`, define it here:
  verifyCaptcha(data: {
    captcha_input: string;
    captcha_key: string;
    captcha_secret: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/Capatcha/Verify`, data);
  }
}
