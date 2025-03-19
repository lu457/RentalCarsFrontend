import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../core/config.service';
import { Vehiculo } from '../../../models/vehiculo.model';
import { VehiculoService } from '../vehiculo.service';

@Component({
  selector: 'app-vehiculo-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './vehiculo-detail.component.html',
  styleUrl: './vehiculo-detail.component.css',
})
export class VehiculoDetailComponent implements OnInit {
  vehiculo = signal<Vehiculo | null>(null);
  isLoading = signal<boolean>(true);
  defaultImage = 'assets/default-vehiculo.webp';

  private vehiculoService = inject(VehiculoService);
  private route = inject(ActivatedRoute);
  private configService = inject(ConfigService);

  ngOnInit(): void {
    const vehiculoId = this.route.snapshot.paramMap.get('id');
    if (vehiculoId) {
      this.loadVehiculo(vehiculoId);
    }
  }

  loadVehiculo(id: string) {
    this.vehiculoService.getVehiculoById(id).subscribe({
      next: (data) => {
        if (data) {
          this.vehiculo.set({
            ...data,
            imageUrls: data.imageUrls?.length
              ? data.imageUrls.map((img) => this.getFullImageUrl(img))
              : [this.defaultImage],
          });
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  getFullImageUrl(imagePath: string): string {
    return imagePath.startsWith('http')
      ? imagePath
      : `${this.configService.apiUrl}${imagePath}`;
  }
}