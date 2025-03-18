import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ConfigService } from './config.service';

interface AuthResponse {
  token: string;
  email: string;
  nombreCompleto: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private http = inject(HttpClient);
  private router = inject(Router);
  private configService = inject(ConfigService);
  private snackBar = inject(MatSnackBar);
  private apiUrl = this.configService.apiUrl;

  isAuthenticated = signal(!!localStorage.getItem(this.tokenKey));
  userName = signal(localStorage.getItem('nombreCompleto') || '');

  constructor() {}

  login(credentials: {
    email: string;
    contraseña: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('email', response.email);
          localStorage.setItem('nombreCompleto', response.nombreCompleto);
          this.isAuthenticated.set(true);
          this.userName.set(response.nombreCompleto);
        })
      );
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('nombreCompleto');
    this.isAuthenticated.set(false);
    this.userName.set('');
    this.router.navigate(['/']);
  }
  register(credentials: {
    nombre: string;
    apellido: string;
    email: string;
    contraseña: string;
    celular: string;
  }): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/api/auth/register`,
      credentials
    );
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return true;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expiry = tokenPayload.exp * 1000;
      return Date.now() > expiry;
    } catch (error) {
      console.error(`[isTokenExpired] ${error}`);
      return false;
    }
  }

  checkSessionValidity(): void {
    if (this.isTokenExpired()) {
      this.logout();

      this.snackBar.open(
        'Tu sesión ha experiado. Inicia sesión nuevamente.',
        'Cerrar',
        {
          duration: 3000,
        }
      );
    }
  }

  monitorSession() {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return;
    }

    try {
      const tokenPayload = JSON.parse(token.split('.')[1]);
      const expiryTime = tokenPayload.exp * 1000;
      const warningTime = expiryTime - 5 * 60 * 1000;

      setTimeout(() => {
        this.snackBar.open(
          'Tu sesión extá por expirar. Guarda tu trabajo o renueva sesión',
          'Cerrar',
          {
            duration: 7000,
          }
        );
      }, warningTime - Date.now());
    } catch (error) {
      console.error(`[monitorSession] ${error}`);
    }
  }
}


