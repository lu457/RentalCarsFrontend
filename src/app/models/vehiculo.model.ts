export interface Vehiculo {
    id: string;
    fechaCreacion: string;
    fechaActualizacion: string;
    marca: string;
    modelo: string;
    ubicacion: string;
    year: number;
    precioPorDia: number;
    calle: string;
    ciudad: string;
    pais: string;
    tipo: string;
    estado: string;
    descripcion: string;
    motor: string;
    cilindros: number;
    puertas: number;
    capacidadPasajeros?: number;
    combustible: string;
    transmision: string;
    calificacionPromedio?: number;
    resenas: any[];
    imageUrls: string[];
}