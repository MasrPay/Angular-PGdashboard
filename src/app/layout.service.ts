import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private _showSidebar = signal(true);
  showSidebar = this._showSidebar.asReadonly();

  setSidebarVisible(visible: boolean) {
    this._showSidebar.set(visible);
  }

  hideSidebar() {
    this._showSidebar.set(false);
  }

  showSidebarFn() {
    this._showSidebar.set(true);
  }
} 