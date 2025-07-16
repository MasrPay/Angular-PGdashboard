import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],  // <-- Add this to recognize <router-outlet>
  template: `<router-outlet></router-outlet>`,

})
export class AppComponent {}
