import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateVehiculoRequestDto } from '../../../models/dtos/update-vehiculo.dto';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { VehiculoService } from '../vehiculo.service';

@Component({
  selector: 'app-vehiculo-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './vehiculo-form.component.html',
  styleUrl: './vehiculo-form.component.css',
})
export class VehiculoFormComponent {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  form: FormGroup;
  vehiculoId: string | null;
  isEditMode = signal(false);
  isLoading = signal(false);
  imagePreviews: string[] = [];
  selectedImages: File[] = [];

  constructor() {
    this.form = this.fb.group({
      calle: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      year: [1999, [Validators.required, Validators.min(1999)]],
      precioPorDia: [0, [Validators.required, Validators.min(1)]],
      tipo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      motor: ['', Validators.required],
      cilindros: [1, [Validators.required, Validators.min(1)]],
      puertas: [1, [Validators.required, Validators.min(1)]],
      capacidadPasajeros: [1, [Validators.required, Validators.min(1)]],
      combustible: ['', Validators.required],
      transmision: ['', Validators.required],
    });

    this.vehiculoId = this.route.snapshot.paramMap.get('id');
    if (this.vehiculoId) {
      this.isEditMode.set(true);
      this.loadVehiculo(this.vehiculoId);
    }
  }

  loadVehiculo(id: string) {
    this.vehiculoService.getVehiculoById(id).subscribe((vehiculo) => {
      this.form.patchValue(vehiculo);
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.selectedImages = Array.from(input.files);
    this.imagePreviews = this.selectedImages.map((file) =>
      URL.createObjectURL(file)
    );
  }

  showConfirmationDialog(message: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  saveVehiculo() {
    if (this.form.invalid) {
      this.snackBar.open(
        'Por favor, completa todos los campos correctamente.',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    this.isLoading.set(true);
    const vehiculoData = this.form.value;

    if (this.isEditMode()) {
      const updateRequest: UpdateVehiculoRequestDto = {
        ...vehiculoData,
        id: this.vehiculoId,
      };

      this.vehiculoService.updateVehiculo(updateRequest).subscribe({
        next: () => {
          this.uploadImagesIfNeeded(this.vehiculoId!);
        },
        error: () => {
          this.isLoading.set(false);
          this.snackBar.open('Error al actualizar vehiculo', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    } else {
      this.vehiculoService.createVehiculo(vehiculoData).subscribe({
        next: (response) => {
          this.uploadImagesIfNeeded(response.id);
        },
        error: () => {
          this.isLoading.set(false);
          this.snackBar.open('Error al registrar vehiculo', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    }
  }

  uploadImagesIfNeeded(vehiculoId: string) {
    if (this.selectedImages.length > 0) {
      this.vehiculoService
        .uploadVehiculoImages(vehiculoId, this.selectedImages)
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.showConfirmationDialog(
              'Vehiculos e imágenes guardados con éxito'
            );
          },
          error: () => {
            this.isLoading.set(false);
            this.snackBar.open('Error al subir imágenes', 'Cerrar', {
              duration: 3000,
            });
          },
        });
    } else {
      this.isLoading.set(false);
      this.showConfirmationDialog('Vehiculo guardado con éxito');
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}

