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
  imagePreviews: { url: string; file: File; esPrincipal: boolean }[] = [];
  selectedImages: File[] = [];
  selectedPrincipalIndex: number | null = null; // Índice de la imagen principal

  constructor() {
    this.form = this.fb.group({
      calle: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      year: [1999, [Validators.required, Validators.min(1999)]],
      precioPorDia: ['', [Validators.required, Validators.min(1)]],
      tipo: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      motor: ['', Validators.required],
      cilindros: [1, [Validators.required, Validators.min(1)]],
      puertas: [4, [Validators.required, Validators.min(4)]],
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
      if (vehiculo.ubicacion) {
        const [calle, ciudad, pais] = vehiculo.ubicacion.split(', ');
        Object.assign(vehiculo, { calle, ciudad, pais });
      }
      this.form.patchValue(vehiculo);
    });
  }
  

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
  
    this.selectedImages = Array.from(input.files);
    this.imagePreviews = this.selectedImages.map((file, index) => ({
      url: URL.createObjectURL(file),
      file,
      esPrincipal: index === 0,
    }));
    this.selectedPrincipalIndex = 0;
  }
  
  setPrincipalImage(index: number) {
    this.selectedPrincipalIndex = index;
    this.imagePreviews.forEach((img, i) => img.esPrincipal = (i === index));
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
      const formData = new FormData();
      
      this.selectedImages.forEach((file, index) => {
        formData.append('files', file);
        formData.append('esPrincipal', index === 0 ? '1' : '0');
      });
  
      this.vehiculoService.uploadVehiculoImages(vehiculoId, formData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.showConfirmationDialog('Vehículo e imágenes guardados con éxito');
        },
        error: () => {
          this.isLoading.set(false);
          this.snackBar.open('Error al subir imágenes', 'Cerrar', { duration: 3000 });
        },
      });
    } else {
      this.isLoading.set(false);
      this.showConfirmationDialog('Vehículo guardado con éxito');
    }
  }
  

  removeImage(index: number) {
    URL.revokeObjectURL(this.imagePreviews[index].url);
    
    // Eliminar la imagen de las listas
    this.imagePreviews.splice(index, 1);
    this.selectedImages.splice(index, 1);
  
    if (this.selectedPrincipalIndex === index) {
      this.selectedPrincipalIndex = this.imagePreviews.length > 0 ? 0 : null;
      if (this.selectedPrincipalIndex !== null) {
        this.imagePreviews[0].esPrincipal = true;
      }
    }
  
    const fileInput = document.querySelector<HTMLInputElement>('#fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  }
  
  cancel() {
    this.router.navigate(['/']);
  }
}