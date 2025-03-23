import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../core/config.service';
import { CreateVehiculoRequestDto } from '../../models/dtos/create-vehiculo.dto';
import { VehiculoResponseDto } from '../../models/dtos/vehiculo-response.dto';
import { UpdateVehiculoRequestDto } from '../../models/dtos/update-vehiculo.dto';
import { Vehiculo } from '../../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private configService = inject(ConfigService);
  private apiUrl = this.configService.apiUrl;

  constructor(private http: HttpClient) {}

  getVehiculos(query: string = ''): Observable<Vehiculo[]> {
    const endpoint = query ? `/api/vehiculos/filtrar?${query}` : `/api/vehiculos`;
    return this.http.get<Vehiculo[]>(`${this.apiUrl}${endpoint}`);
  }
  
  getVehiculosPorPropietario(): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(`${this.apiUrl}/api/vehiculos/propietario`);
  }
  

  getVehiculoById(id: string): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/api/vehiculos/${id}`);
  }

  createVehiculo(
    vehiculo: CreateVehiculoRequestDto
  ): Observable<VehiculoResponseDto> {
    return this.http.post<VehiculoResponseDto>(
      `${this.apiUrl}/api/vehiculos`,
      vehiculo
    );
  }

  updateVehiculo(
    vehiculo: UpdateVehiculoRequestDto
  ): Observable<VehiculoResponseDto> {
    return this.http.put<VehiculoResponseDto>(
      `${this.apiUrl}/api/vehiculos/${vehiculo.id}`,
      vehiculo
    );
  }

  uploadVehiculoImages(vehiculoId: string, formData: FormData): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/api/vehiculos/${vehiculoId}/images`,
      formData
    );
  }
  

  deleteVehiculo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/vehiculos/${id}`);
  }
}
