import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehiculo } from '../../models/vehiculo.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private apiUrl= `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getVehiculos(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.apiUrl}/vehiculos`);
  }
}
