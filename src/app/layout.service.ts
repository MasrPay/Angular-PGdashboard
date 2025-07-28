import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _showSidebar = signal(true);
  showSidebar = this._showSidebar.asReadonly();

  private _showNavbar = signal(false);
  showNavbar = this._showNavbar.asReadonly();

  setSidebarVisible(visible: boolean) {
    this._showSidebar.set(visible);
  }

  hideSidebar() {
    this._showSidebar.set(false);
  }

  showSidebarFn() {
    this._showSidebar.set(true);
  }

  setNavbarVisible(visible: boolean) {
    this._showNavbar.set(visible);
  }

  hideNavbar() {
    this._showNavbar.set(false);
  }

  showNavbarFn() {
    this._showNavbar.set(true);
  }
} 