export interface ReservationData {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  telefono: string;
  cantidad_personas: number;
  fecha_reserva: string; // Formato: YYYY-MM-DD
  horario: string;
  notas?: string;
}

export interface ApiResponse {
  success: boolean;
  reserva: {
    id: number;
    fecha_reserva: string;
    horario: string;
    estado: string;
  };
}