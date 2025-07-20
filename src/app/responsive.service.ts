import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ScreenSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private screenSizeSubject = new BehaviorSubject<ScreenSize>(this.getScreenSize());
  public screenSize$ = this.screenSizeSubject.asObservable();

  constructor() {
    this.initializeResizeListener();
  }

  private getScreenSize(): ScreenSize {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    let breakpoint: ScreenSize['breakpoint'];
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;

    if (width < 640) {
      breakpoint = 'xs';
      isMobile = true;
    } else if (width < 768) {
      breakpoint = 'sm';
      isMobile = true;
    } else if (width < 1024) {
      breakpoint = 'md';
      isTablet = true;
    } else if (width < 1280) {
      breakpoint = 'lg';
      isDesktop = true;
    } else if (width < 1536) {
      breakpoint = 'xl';
      isDesktop = true;
    } else {
      breakpoint = '2xl';
      isDesktop = true;
    }

    return { width, height, isMobile, isTablet, isDesktop, breakpoint };
  }

  private initializeResizeListener(): void {
    window.addEventListener('resize', () => {
      this.screenSizeSubject.next(this.getScreenSize());
    });
  }

  getCurrentScreenSize(): ScreenSize {
    return this.screenSizeSubject.value;
  }

  isMobile(): boolean {
    return this.getCurrentScreenSize().isMobile;
  }

  isTablet(): boolean {
    return this.getCurrentScreenSize().isTablet;
  }

  isDesktop(): boolean {
    return this.getCurrentScreenSize().isDesktop;
  }

  getBreakpoint(): ScreenSize['breakpoint'] {
    return this.getCurrentScreenSize().breakpoint;
  }
} 