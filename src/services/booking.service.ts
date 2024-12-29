import api from './api';

export interface Booking {
  user: string;
  room: string;
  bed_number: string;
  price_per_bed: number;
  checkin_date: Date;
  checkout_date: Date;
  status: 'confirmed' | 'pending' | 'canceled';
  payment_status: 'completed' | 'pending' | 'failed';
  payment_method: 'cash' | 'online';
  transaction_id?: string;
}

export const bookingService = {

  async createBookingByUser(bookingData: Omit<Booking, 'user' | 'status' | 'payment_status'>) {
    const response = await api.post('/book/admin/anonymous-booking', bookingData);
    return response.data;
  },
  async createBooking(bookingData: Omit<Booking, 'user' | 'status' | 'payment_status'>) {
    const response = await api.post('/book/book-bed', bookingData);
    return response.data;
  },

  async getAllBookings() {
    const response = await api.get('/book/all/booking');
    return response.data;
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']) {
    const response = await api.put('/book/status', { bookingId, status });
    return response.data;
  },

  async updatePaymentStatus(
    bookingId: string,
    payment_status: Booking['payment_status'],
    payment_method: Booking['payment_method'],
    transaction_id?: string
  ) {
    const response = await api.put(`/book/booking/${bookingId}/payment-status`, {
      payment_status,
      payment_method,
      transaction_id
    });
    return response.data;
  },

  async generateReceipt(bookingId: string) {
    const response = await api.get(`/book/generate-receipt/${bookingId}`);
    return response.data;
  }
};