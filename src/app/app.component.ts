import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatCardModule,
    NavBarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'RentalsCars';
  private router = inject(Router);
  private authService = inject(AuthService);

  private currentUrl = signal(this.router.url);

  constructor() {
    const invalidRoutes = ['/', ''];
    if (!invalidRoutes.includes(this.router.url)) {
      this.authService.checkSessionValidity();
      this.authService.monitorSession();
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.set(event.urlAfterRedirects);
      }
    });
  }

  shouldShowNavbar = computed(() => {
    const hiddenRoutes = ['/login', '/register'];
    return !hiddenRoutes.includes(this.currentUrl());
  });
}
