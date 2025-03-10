import { Component, OnInit } from '@angular/core';
import { Vehiculo } from '../../../models/vehiculo.model';
import { VehiculoService } from '../vehiculo.service';


@Component({
  selector: 'app-vehiculo-list',
  standalone: true,
  imports: [],
  templateUrl: './vehiculo-list.component.html',
  styleUrl: './vehiculo-list.component.css'
})
export class VehiculoListComponent implements OnInit{
  vehiculos: Vehiculo[] = [];

  constructor(private vehiculoService: VehiculoService) {}

  ngOnInit(): void {
    this.vehiculoService.getVehiculos().subscribe((data) => {
      this.vehiculos = data;
    });
  }
}
