export interface VehiculoResponseDto {
    id: string;
    marca: string;
    modelo: string;
    year: number;
    precioPorDia: number;
    ubicacion: string;
    tipo: string;
    estado: string;
    descripcion: string;
    motor: string;
    cilindros: number;
    puertas: number;
    capacidadPasajeros: number;
    combustible: string;
    transmision: string;
    propietarioId: string;
    imageUrls: string[];
    fechaCreacion: string;
    fechaActualizacion: string;
}