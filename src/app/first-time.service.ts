import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PostService } from './post';

export interface FirstTimeStatus {
  needsTermsAcceptance: boolean;
  needsPasswordChange: boolean;
  isFirstTime: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirstTimeService {
  private firstTimeStatus = new BehaviorSubject<FirstTimeStatus>({
    needsTermsAcceptance: false,
    needsPasswordChange: false,
    isFirstTime: false
  });

  constructor(private postService: PostService) {}

  // Check if user needs first-time actions
  checkFirstTimeStatus(): Observable<FirstTimeStatus> {
    // For now, we'll use sessionStorage to check
    // In production, this should call an API endpoint
    const token = sessionStorage.getItem('access_token');
    const termsAccepted = sessionStorage.getItem('terms_accepted');
    const passwordChanged = sessionStorage.getItem('password_changed');

    console.log('Checking first-time status:', {
      token: token ? 'exists' : 'missing',
      termsAccepted,
      passwordChanged
    });

    const status: FirstTimeStatus = {
      needsTermsAcceptance: !termsAccepted,
      needsPasswordChange: !passwordChanged,
      isFirstTime: !termsAccepted || !passwordChanged
    };

    console.log('First-time status result:', status);
    this.firstTimeStatus.next(status);
    return this.firstTimeStatus.asObservable();
  }

  // Check backend status for terms acceptance
  checkBackendTermsStatus(): Observable<any> {
    return this.postService.acceptTerms(); // This will fail if already accepted, which is what we want
  }

  // Accept terms and conditions
  acceptTerms(): Observable<any> {
    return this.postService.acceptTerms();
  }

  // Change password for first-time users
  changePassword(payload: { current_password: string; password: string; password_confirmation: string }): Observable<any> {
    return this.postService.changePassword(payload);
  }

  // Mark terms as accepted locally
  markTermsAccepted(): void {
    sessionStorage.setItem('terms_accepted', 'true');
    this.updateStatus();
  }

  // Mark password as changed locally
  markPasswordChanged(): void {
    sessionStorage.setItem('password_changed', 'true');
    this.updateStatus();
  }

  // Update the current status
  private updateStatus(): void {
    const termsAccepted = sessionStorage.getItem('terms_accepted');
    const passwordChanged = sessionStorage.getItem('password_changed');

    const status: FirstTimeStatus = {
      needsTermsAcceptance: !termsAccepted,
      needsPasswordChange: !passwordChanged,
      isFirstTime: !termsAccepted || !passwordChanged
    };

    this.firstTimeStatus.next(status);
  }

  // Get current status
  getCurrentStatus(): FirstTimeStatus {
    return this.firstTimeStatus.value;
  }
} 