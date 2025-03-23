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
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-vehiculo-list',
  standalone: true,
  imports: [
    FormsModule,
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
  tiposVehiculo: string[] = ['Sedan', 'SUV', 'Camioneta', 'Deportivo', 'Electrico', 'Compacto'];
  ubicacion: string = '';
  tipoVehiculo: string = '';
  loadingImages: { [key: string]: boolean } = {};
  defaultImage = 'assets/default-vehiculo.png';

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
        this.vehiculos.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
  recargarVehiculos() {
    this.filtroAplicado = false;
    this.loadVehiculos('');
  }
  
  limpiarFiltros() {
    this.filtroAplicado = false;
    this.ubicacion = '';
    this.tipoVehiculo = '';
    this.filtrarVehiculos();
  }
  
  filtroAplicado = false;

  filtrarVehiculos() {
    this.filtroAplicado = true;
  
    let queryParams = [];
  
    if (this.ubicacion.trim()) {
      queryParams.push(`ubicacion=${encodeURIComponent(this.ubicacion)}`);
    }
  
    if (this.tipoVehiculo) {
      queryParams.push(`tipoVehiculo=${this.tipoVehiculo}`);
    }
  
    const queryString = queryParams.length ? queryParams.join('&') : '';
  
    this.loadVehiculos(queryString);
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
