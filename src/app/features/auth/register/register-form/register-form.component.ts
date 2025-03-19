import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form: FormGroup;
  isLoading = signal(false);

  constructor() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open(
        'Por favor, completa todos los campos correctamente.',
        'Cerrar',
        {
          duration: 3000,
        }
      );

      return;
    }

    this.isLoading.set(true);
    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open(
          'Registro Exitoso. Ahora puedes iniciar sesión',
          'Cerrar',
          {
            duration: 3000,
          }
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000); // Espera 3 segundos antes de redirigir
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.snackBar.open(
          `Error: ${error.message || 'No se pudo registrar'}`,
          'Cerrar',
          {
            duration: 3000,
          }
        );
      },
    });
  }
}