import { Usuario } from "./usuario.model";
import { Vehiculo } from "./vehiculo.model";

export class Reserva {
    constructor(
      public id: number,
      public usuario: Usuario,
      public vehiculo: Vehiculo,
      public fechaInicio: Date,
      public fechaFinal: Date,
      public precioTotal: number
    ) {}
  }
  