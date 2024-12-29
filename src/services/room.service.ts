import api from './api';

export interface Bed {
  bed_number: string;
  status: 'available' | 'occupied' | 'maintenance';
  price_per_bed: number;
}

export interface Room {
  room_number: string;
  type: string;
  beds: Bed[];
  features: string[];
}

export const roomService = {
  async createRoom(roomData: Room) {
    const response = await api.post('/room/create', roomData);
    return response.data;
  },
  async  getAllRooms()  {
    try {
      const response = await api.get(`/room/all`);
      return response.data;
  } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
  }
  },

  async updateRoom(roomNumber: string, roomData: Partial<Room>) {
    const response = await api.put(`/rooms/${roomNumber}`, roomData);
    return response.data;
  },

  async addBedToRoom(roomNumber: string, bedData: Bed[]) {
    const response = await api.post(`/room/room/${roomNumber}/add-bad`, { bad: bedData });
    return response.data;
  },

  async updateBedStatus(roomNumber: string, bedNumber: string, status: string, price: number) {
    const response = await api.put(`/rooms/room/${roomNumber}/bad/${bedNumber}`, {
      status,
      price_per_bed: price
    });
    return response.data;
  }
};

