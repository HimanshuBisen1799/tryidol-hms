import React, { useState, useEffect } from 'react';
import { Calendar, Home, DollarSign, Users } from 'lucide-react';
import { StatCard } from './StatCard';
import { BookingItem } from './BookingItem';
import { TaskItem } from './TaskItem';
import { getAllUsersByRole } from "../../services/user.service";
import { roomService } from "../../services/room.service";
import { bookingService } from '../../services/booking.service';

export function Dashboard() {
  const [staffTotal, setStaffTotal] = useState(0);
  const [roomTotal, setRoomTotal] = useState(0);
  const [bookingTotal, setBookingTotal] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupied: 0,
    maintenance: 0,
    available: 0,
    availableBeds: 0,
  });

  useEffect(() => {
    fetchStaffDetails();
    fetchRooms();
    fetchBookings();
  }, []);

  const fetchStaffDetails = async () => {
    try {
      const response = await getAllUsersByRole("staff");
      setStaffTotal(response.data.length);
    } catch (error) {
      console.error("Error fetching staff details:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await roomService.getAllRooms();
      const roomsData = response.rooms;
      setRoomTotal(roomsData.length);

      const totalRooms = roomsData.length;
      let occupied = 0, maintenance = 0, available = 0, availableBeds = 0;

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

      setStats({ totalRooms, occupied, maintenance, available, availableBeds });
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getAllBookings();
      setBookings(response.bookings);
      setBookingTotal(response.bookings.length);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={bookingTotal}
          Icon={Calendar}
          change={{ value: "3.5%", timeframe: "from last month", isPositive: true }}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Total Rooms"
          value={roomTotal}
          Icon={Home}
          change={{ value: "5", timeframe: "from last week", isPositive: true }}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Available Beds"
          value={stats.availableBeds}
          Icon={DollarSign}
          change={{ value: "2.3%", timeframe: "from last month", isPositive: false }}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Active Staff"
          value={staffTotal}
          Icon={Users}
          change={{ value: "+2", timeframe: "new from last week", isPositive: true }}
          iconBgColor="bg-yellow-100"
        />
      </div>

      {/* Recent Bookings and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <div className="divide-y">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking._id} className="flex items-center space-x-4 py-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white bg-blue-100">
                  {booking.user?.username?.[0]?.toUpperCase() || booking.user_details?.name?.[0]?.toUpperCase() || 'N/A'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {booking.user?.username || booking.user_details?.name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.room.room_number} - {booking.room.type} ({booking.nights || 'N/A'} nights)
                  </p>
                </div>
                <div
  className={`text-sm text-gray-500 capitalize px-2 py-1 rounded-full ${
    booking.payment_status === 'completed'
      ? 'bg-green-100'
      : booking.payment_status === 'pending'
      ? 'bg-red-100'
      : 'bg-gray-200'
  }`}
>
  {booking.payment_status || 'N/A'}
</div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Today's Tasks</h2>
          <div className="divide-y">
            <TaskItem title="Room 302 Cleaning" details="Assigned to: Housekeeping Team A" priority="High" />
            <TaskItem title="Restock Mini Bar" details="Rooms: 201, 203, 205" priority="Medium" />
            <TaskItem title="Maintenance Check" details="AC unit in Room 405" priority="Urgent" />
          </div>
        </div>
      </div>
    </div>
  );
}
