import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/booking.service';

export function AddBookingModal({ rooms, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    room_number: '',
    bed_number: '',
    checkin_date: '',
    checkout_date: '',
    price_per_bed: 500, // Set default price_per_bed value
    status: 'confirmed',
    user_details: {
      name: '',
      email: '',
      phone: '',
    },
  });
  const [availableBeds, setAvailableBeds] = useState([]);

  const handleRoomChange = (e) => {
    const selectedRoomNumber = e.target.value;
    const selectedRoom = rooms.find((room) => room.room_number === selectedRoomNumber);

    if (selectedRoom) {
      setFormData((prev) => ({
        ...prev,
        room_number: selectedRoomNumber,
        bed_number: '',
        price_per_bed: selectedRoom.price_per_bed || 500,
        user_details: { ...prev.user_details },
      }));
      setAvailableBeds(selectedRoom.beds.filter((bed) => bed.status === 'available'));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.user_details) {
      setFormData((prev) => ({
        ...prev,
        user_details: {
          ...prev.user_details,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that price_per_bed is set
    if (!formData.price_per_bed) {
      console.error('Price per bed is required');
      return;
    }

    try {
      // Make the POST request to the backend with the form data
      await bookingService.createBookingByUser(formData);
      onSubmit();
      onClose();
    } catch (err) {
      console.error('Failed to create booking:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-lg p-6 w-full max-w-md md:w-[60vw] lg:w-[50vw] xl:w-[40vw]">
      <h2 className="text-lg font-semibold mb-4">Add Booking</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-auto">
        {/* User Details: Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.user_details.name}
              placeholder='Full Name'
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
  
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.user_details.email}
              onChange={handleInputChange}
              placeholder='Email Address'
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        </div>
  
        {/* User Details: Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder='Phone Number'
            value={formData.user_details.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Room Number Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Room Number</label>
            <select
              name="room_number"
              value={formData.room_number}
              onChange={handleRoomChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="" disabled>Select a Room</option>
              {rooms.map((room) => (
                <option key={room.room_number} value={room.room_number}>
                  {room.room_number}
                
                </option>
              ))}
            </select>
          </div>
  
          {/* Bed Number Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bed Number</label>
            <select
              name="bed_number"
              value={formData.bed_number}
        
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
              disabled={!availableBeds.length}
            >
              <option value="" disabled>Select a Bed</option>
              {availableBeds.map((bed) => (
                <option key={bed._id} value={bed.bed_number}>
                  {bed.bed_number}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Check-in and Check-out Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
            <input
              type="date"
              placeholder='YYYY-MM-DD'
              name="checkin_date"
              value={formData.checkin_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
            <input
              type="date"
              name="checkout_date"
              placeholder='YYYY-MM-DD'
              value={formData.checkout_date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
        </div>
  
        {/* Price per Bed */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price per Bed</label>
          <input
            type="number"
            name="price_per_bed"
            placeholder='price per bed'
            value={formData.price_per_bed}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
  
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600    text-white rounded-lg hover:bg-blue-700"
          >
            Add Booking
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
}
