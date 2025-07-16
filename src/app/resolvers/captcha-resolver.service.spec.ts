import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PostService } from '../services/post.services';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CaptchaResolver implements Resolve<any> {
  constructor(private postService: PostService) {}

  resolve(): Observable<any> {
    return this.postService.generateCaptcha().pipe(
      catchError(() => of(null)) // Handle errors gracefully
    );
  }
}
