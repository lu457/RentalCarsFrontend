export interface UpdateVehiculoRequestDto {
    id: string;
    marca: string;
    modelo: string;
    year: number;
    precioPorDia: number;
    calle: string;
    ciudad: string;
    pais: string;
    tipo: string;
    descripcion: string;
    motor: string;
    cilindros: number;
    puertas: number;
    capacidadPasajeros: number;
    combustible: string;
    transmision: string;
}