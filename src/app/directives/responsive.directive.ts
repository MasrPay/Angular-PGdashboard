import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService, ScreenSize } from '../responsive.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appResponsive]',
  standalone: true
})
export class ResponsiveDirective implements OnInit, OnDestroy {
  @Input() appResponsive: 'mobile' | 'tablet' | 'desktop' | 'mobile-only' | 'tablet-only' | 'desktop-only' = 'desktop';
  
  private subscription: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit() {
    this.subscription = this.responsiveService.screenSize$.subscribe((screenSize: ScreenSize) => {
      this.updateVisibility(screenSize);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateVisibility(screenSize: ScreenSize) {
    const element = this.el.nativeElement;
    
    switch (this.appResponsive) {
      case 'mobile':
        element.style.display = screenSize.isMobile ? 'block' : 'none';
        break;
      case 'tablet':
        element.style.display = screenSize.isTablet ? 'block' : 'none';
        break;
      case 'desktop':
        element.style.display = screenSize.isDesktop ? 'block' : 'none';
        break;
      case 'mobile-only':
        element.style.display = screenSize.isMobile && !screenSize.isTablet && !screenSize.isDesktop ? 'block' : 'none';
        break;
      case 'tablet-only':
        element.style.display = !screenSize.isMobile && screenSize.isTablet && !screenSize.isDesktop ? 'block' : 'none';
        break;
      case 'desktop-only':
        element.style.display = !screenSize.isMobile && !screenSize.isTablet && screenSize.isDesktop ? 'block' : 'none';
        break;
    }
  }
} 