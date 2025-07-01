import axios from 'axios';
import type { ReservationData, ApiResponse } from '../types/reservation';
// ^^^^^^ Agrega la palabra clave 'type' aquí

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const createReservation = async (data: ReservationData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${API_URL}/reservas`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || { error: 'Error al crear reserva' };
    }
    throw new Error('Error desconocido');
  }
};