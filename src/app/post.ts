import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class PostService {
  private baseUrl = 'https://md-new.dev.ho.masrpay.com.eg/api'; // 🌐 Replace with your backend base URL

  constructor(private http: HttpClient) {}

  generateCaptcha(): Observable<any> {
    return this.http.post(`${this.baseUrl}/Capatcha/Generate`, {});
  }

  login(payload: {
    user_name: string;
    password: string;
    captcha_code: string | number;
    captcha_secret: string;
    captcha_key: string;
  }): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': 'test',
      'x-api-secret': 'test_secret'
    });
    return this.http.post(`${this.baseUrl}/admin/auth/login`, payload, { headers });
  }

  sendResetCode(payload: {
    email: string;
    captcha_code: number;
    captcha_secret: string;
    captcha_key: string;
  }): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': 'test',
      'x-api-secret': 'test_secret',
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    return this.http.post(`${this.baseUrl}/admin/auth/send-reset-code`, payload, { headers });
  }

  createUser(payload: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-api-key': 'test',
      'x-api-secret': 'test_secret',
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    return this.http.post(`${this.baseUrl}/admin/manage-user/create`, payload, { headers });
  }

  verifyCode(payload: { email: string; token: string }): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': 'test',
      'x-api-secret': 'test_secret',
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    return this.http.post(`${this.baseUrl}/admin/auth/verify-code`, payload, { headers });
  }

  resetPassword(payload: { email: string; token: string; password: string; password_confirmation: string }): Observable<any> {
    const headers = new HttpHeaders({
      'x-api-key': 'test',
      'x-api-secret': 'test_secret',
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    return this.http.post(`${this.baseUrl}/admin/auth/reset-password`, payload, { headers });
  }

  changePassword(payload: { current_password: string; password: string; password_confirmation: string }): Observable<any> {
    const token = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-api-key': 'test',
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    return this.http.post(`${this.baseUrl}/admin/change-password`, payload, { headers });
  }

  acceptTerms(): Observable<any> {
    const token = sessionStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'x-api-key': 'test',
      'x-api-secret': 'test_secret',
      'Content-Type': 'application/json',
      'Accept': '*/*'
    });
    return this.http.post(`${this.baseUrl}/admin/accept-terms`, {}, { headers });
  }


  // If there's a verify endpoint like `/Capatcha/Verify`, define it here:
  // verifyCaptcha(data: {
  //   captcha_input: string;
  //   captcha_key: string;
  //   captcha_secret: string;
  // }): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/Capatcha/Verify`, data);
  // }
}
