import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostService } from '../services/post.services'; // adjust if needed

@Injectable({ providedIn: 'root' })
export class CaptchaResolver implements Resolve<any> {
  constructor(private postService: PostService) {}

  resolve(): Observable<any> {
    return this.postService.generateCaptcha().pipe(
      catchError((error) => {
        console.error('Captcha Resolver Error:', error);
        return of(null);
      })
    );
  }
}
