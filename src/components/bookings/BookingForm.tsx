import React, { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { bookingService } from '../../services/booking.service';

export function BookingForm() {
  const [booking, setBooking] = useState({
    room_number: '',
    bed_number: '',
    checkin_date: '',
    checkout_date: '',
    payment_method: 'online' as const
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await bookingService.createBooking({
        room: booking.room_number,
        bed_number: booking.bed_number,
        checkin_date: new Date(booking.checkin_date),
        checkout_date: new Date(booking.checkout_date),
        payment_method: booking.payment_method,
        price_per_bed: 0 // This will be set by the server based on the room
      });
      setSuccess('Booking created successfully');
      setBooking({
        room_number: '',
        bed_number: '',
        checkin_date: '',
        checkout_date: '',
        payment_method: 'online'
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">New Booking</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
          <AlertCircle className="mr-2" size={20} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Number</label>
          <input
            type="text"
            value={booking.room_number}
            onChange={e => setBooking(prev => ({ ...prev, room_number: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bed Number</label>
          <input
            type="text"
            value={booking.bed_number}
            onChange={e => setBooking(prev => ({ ...prev, bed_number: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={booking.checkin_date}
                onChange={e => setBooking(prev => ({ ...prev, checkin_date: e.target.value }))}
                className="mt-1 block w-full pl-10 rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                value={booking.checkout_date}
                onChange={e => setBooking(prev => ({ ...prev, checkout_date: e.target.value }))}
                className="mt-1 block w-full pl-10 rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Method</label>
          <select
            value={booking.payment_method}
            onChange={e => setBooking(prev => ({ ...prev, payment_method: e.target.value as 'cash' | 'online' }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="online">Online Payment</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isLoading ? 'Creating Booking...' : 'Create Booking'}
        </button>
      </form>
    </div>
  );
}