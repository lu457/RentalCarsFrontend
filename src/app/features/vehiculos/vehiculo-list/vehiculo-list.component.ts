import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { ConfigService } from '../../../core/config.service';
import { Vehiculo } from '../../../models/vehiculo.model';
import { VehiculoService } from '../vehiculo.service';


@Component({
  selector: 'app-vehiculo-list',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './vehiculo-list.component.html',
  styleUrl: './vehiculo-list.component.css'
})
export class VehiculoListComponent implements OnInit {
  vehiculos = signal<Vehiculo[]>([]);
  isLoading = signal<boolean>(false);
  loadingImages: { [key: string]: boolean } = {};
  defaultImage = 'assets/default-property.webp';

  private configService = inject(ConfigService);
  private vehiculoService = inject(VehiculoService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadVehiculos();
  }

  loadVehiculos(query: string = '') {
    this.isLoading.set(true);

    this.vehiculoService.getVehiculos(query).subscribe({
      next: (data) => {
        this.vehiculos.set(
          data.map((vehiculo) => ({
            ...vehiculo,
            imageUrls:
              vehiculo.imageUrls?.length && vehiculo.imageUrls[0]
                ? vehiculo.imageUrls.map((img) => this.getFullImageUrl(img))
                : [this.defaultImage],
          }))
        );

        this.vehiculos().forEach((vehiculo) => {
          this.loadingImages[vehiculo.id] = true;
        });

        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) {
      return this.defaultImage;
    }
    return imagePath.startsWith('http')
      ? imagePath
      : `${this.configService.apiUrl}${imagePath}`;
  }

  onImageLoad(vehiculoId: string) {
    this.loadingImages[vehiculoId] = false;
  }

  onImageError(vehiculo: Vehiculo, index: number) {
    console.error(`Error cargando imagen para vehiculo ${vehiculo.id}`);

    const updatedImages = [...vehiculo.imageUrls];
    updatedImages[index] = this.defaultImage;

    const updatedVehiculos = this.vehiculos().map((v) =>
      v.id === vehiculo.id ? { ...v, imageUrls: updatedImages } : v
    );

    this.vehiculos.set(updatedVehiculos);
  }

  openVehiculoInNewTab(id: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/vehiculo', id])
    );
    window.open(url, '_blank');
  }
}
