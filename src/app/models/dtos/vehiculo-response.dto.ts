export interface VehiculoResponseDto {
    id: string; // ID del vehículo (UUID)
    marca: string; // Marca del vehículo
    modelo: string; // Modelo del vehículo
    year: number; // Año del vehículo
    precioPorDia: number; // Precio por día
    ubicacion: string; // Ubicación del vehículo
    tipo: string; // Tipo de vehículo (SUV, Sedan, etc.)
    estado: string; // Estado de disponibilidad (Disponible, No Disponible)
    descripcion: string; // Descripción del vehículo
    motor: string; // Tipo de motor
    cilindros: number; // Número de cilindros
    puertas: number; // Número de puertas
    capacidadPasajeros: number; // Capacidad de pasajeros
    combustible: string; // Tipo de combustible (Gasolina, Eléctrico, etc.)
    transmision: string; // Tipo de transmisión (Manual, Automática)
    propietarioId: string; // ID del propietario del vehículo (UUID)
    imageUrls: string[]; // Lista de URLs de imágenes
    fechaCreacion: string;
    fechaActualizacion: string;
}