import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculoService } from '../vehiculo.service';
import { Vehiculo } from '../../../models/vehiculo.model';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehiculo-tabla',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './vehiculo-tabla.component.html',
  styleUrls: ['./vehiculo-tabla.component.css']
})
export class VehiculoTablaComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  loading = true;

  constructor(private vehiculoService: VehiculoService, private router: Router) {}

  ngOnInit(): void {
    this.vehiculoService.getVehiculosPorPropietario().subscribe(
      (data) => {
        this.vehiculos = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los vehículos:', error);
        this.loading = false;
      }
    );
  }
  
  eliminarVehiculo(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehiculoService.deleteVehiculo(id).subscribe(
          () => {
            this.vehiculos = this.vehiculos.filter(v => v.id !== id);
            Swal.fire('Eliminado', 'El vehículo ha sido eliminado.', 'success');
          },
          (error) => {
            console.error('Error al eliminar el vehículo:', error);
            Swal.fire('Error', 'No se pudo eliminar el vehículo.', 'error');
          }
        );
      }
    });
  }
    editarVehiculo(id: string): void {
      this.router.navigate(['/vehiculos/editar', id]); 
    }
  isLoading(): boolean {
    return this.loading;
  }
  
}
