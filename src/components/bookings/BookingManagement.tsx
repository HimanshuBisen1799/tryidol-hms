import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { RoomCard } from './RoomCard';
import BookingTable from './BookingTable';
import { roomService } from '../../services/room.service';
import { bookingService } from '../../services/booking.service'; 
import { AddBookingModal } from './AddBookingModal';

export function BookingManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupied: 0,
    maintenance: 0,
    available: 0,
    availableBeds: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await roomService.getAllRooms();
      const roomsData = response.rooms;

      const totalRooms = roomsData.length;
      let occupied = 0,
        maintenance = 0,
        available = 0,
        availableBeds = 0;

      roomsData.forEach((room) => {
        room.beds.forEach((bed) => {
          if (bed.status === 'occupied') occupied++;
          if (bed.status === 'maintenance') maintenance++;
          if (bed.status === 'available') {
            available++;
            availableBeds++;
          }
        });
      });

      setStats({
        totalRooms,
        occupied,
        maintenance,
        available,
        availableBeds,
      });

      setRooms(roomsData);
    } catch (error) {
      setError('Failed to fetch rooms. Please try again later.');
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewBookingClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-1 p-1 mt-8 md:mt-2 lg:p-6 lg:mt-3">
      {/* Header */}
      <div className="flex  lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <h1 className="md:text-2xl   text-2xl font-semibold text-gray-800">Booking Management</h1>
        <button
          onClick={() => handleNewBookingClick(null)}
          className="bg-transparent text-blue-500 border-2 border-blue-100 hover:border-blue-400 md:px-4 md:py-2 md:mb-0  px-2 py-1 md:ml-0 text-sm  ml-[11vw] rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>New Booking</span>
        </button>
      </div>

      {/* Room Availability Stats */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Total Rooms */}
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Rooms</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalRooms}</p>
          </div>
          {/* Occupied */}
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-red-700">Occupied</h3>
            <p className="text-2xl font-bold text-red-800">{stats.occupied}</p>
          </div>
          {/* Maintenance */}
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-yellow-700">Maintenance</h3>
            <p className="text-2xl font-bold text-yellow-800">{stats.maintenance}</p>
          </div>
          {/* Available Beds */}
          <div className="col-span-2 sm:col-span-1 bg-blue-100 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-blue-700">Available Beds</h3>
            <p className="text-2xl font-bold text-blue-800">{stats.availableBeds}</p>
          </div>
        </div>
      </div>

      {/* Room Availability Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Room Details</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                number={room.room_number}
                type={room.type}
                status={room.beds.some((bed) => bed.status === 'occupied') ? 'occupied' : 'available'}
                onClick={() => handleNewBookingClick(room)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Current Bookings Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <BookingTable />
      </div>

      {/* Add Booking Modal */}
      {isModalOpen && (
      <AddBookingModal
      rooms={rooms}
      onClose={handleCloseModal}
      onSubmit={fetchRooms} // Refresh rooms after booking
    />
      )}
    </div>
  );
}
