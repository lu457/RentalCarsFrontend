import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin() {
    this.isLoading = true;
    
    this.authService
      .login({ email: this.email, contraseña: this.password })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Credenciales incorrectas. Inténtalo de nuevo.',
            'Cerrar',
            {
              duration: 3000,
            }
          );
        },
      });
    }

    goToRegister() {
      this.router.navigate(['/register']);
    }
  }
