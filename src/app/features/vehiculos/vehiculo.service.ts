import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehiculo } from '../../models/vehiculo.model';
import { CreateVehiculoRequestDto } from '../../models/dtos/create-vehiculo.dto';
import { VehiculoResponseDto } from '../../models/dtos/vehiculo-response.dto';
import { UpdateVehiculoRequestDto } from '../../models/dtos/update-vehiculo.dto';
import { ConfigService } from '../../core/config.service';


@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private configService = inject(ConfigService);
  private apiUrl = this.configService.apiUrl;

  constructor(private http: HttpClient) {}

  getVehiculos(
    query: string = '',
    page: number = 1,
    limit: number = 10
  ): Observable<Vehiculo[]> {
    return this.http.get<Vehiculo[]>(
      `${this.apiUrl}/api/vehiculos?${query}&page=${page}&limit=${limit}`
    );
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
      `${this.apiUrl}/api/vehiculo/${vehiculo.id}`,
      vehiculo
    );
  }

  uploadVehiculoImages(vehiculoId: string, images: File[]): Observable<void> {
    const formData = new FormData();

    images.forEach((image) => {
      formData.append('images', image);
    });

    return this.http.post<void>(
      `${this.apiUrl}/api/vehiculos/${vehiculoId}/images`,
      formData
    );
  }

  deleteVehiculo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/vehiculo/${id}`);
  }
}
