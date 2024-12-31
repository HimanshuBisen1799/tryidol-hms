import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar, CheckCircle, LogOut } from 'lucide-react';
import { GuestCard } from './GuestCard';
import { bookingService, Booking } from '../../services/booking.service';
import { format } from 'date-fns';

export function GuestManagement() {
  const [bookings, setBookings] = useState<{
    currentBookings: Booking[];
    upcomingBookings: Booking[];
    recentCheckouts: Booking[];
  }>({
    currentBookings: [],
    upcomingBookings: [],
    recentCheckouts: []
  });

  const [activeTab, setActiveTab] = useState<'current' | 'upcoming' | 'recent'>('current');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getBookingsByStatus();
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const renderBookings = () => {
    let bookingsToShow: Booking[] = [];
    let emptyMessage = '';

    switch (activeTab) {
      case 'current':
        bookingsToShow = bookings.currentBookings;
        emptyMessage = 'No current guests';
        break;
      case 'upcoming':
        bookingsToShow = bookings.upcomingBookings;
        emptyMessage = 'No upcoming bookings';
        break;
      case 'recent':
        bookingsToShow = bookings.recentCheckouts;
        emptyMessage = 'No recent checkouts';
        break;
    }

    if (bookingsToShow.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookingsToShow.map((booking) => (
          <GuestCard
            key={booking._id}
            initials={booking.user_details?.name.split(' ').map(n => n[0]).join('') || 'G'}
            name={booking.user_details?.name || 'Guest'}
            type={activeTab === 'current' ? 'Current Guest' : activeTab === 'upcoming' ? 'Upcoming Guest' : 'Checked Out'}
            email={booking.user_details?.email || 'N/A'}
            phone={booking.user_details?.phone || 'N/A'}
            status={activeTab === 'current' ? 'Currently Staying' : activeTab === 'upcoming' ? 'Upcoming Stay' : 'Checked Out'}
            checkinDate={format(new Date(booking.checkin_date), 'MMM dd, yyyy')}
            checkoutDate={format(new Date(booking.checkout_date), 'MMM dd, yyyy')}
            roomNumber={booking.bed_number}
            bgColor={
              activeTab === 'current' ? 'bg-green-100' : 
              activeTab === 'upcoming' ? 'bg-blue-100' : 
              'bg-gray-100'
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Guest Management</h1>
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search guests..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div> */}
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'current'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('current')}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} />
            <span>Current Guests</span>
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          <div className="flex items-center space-x-2">
            <Calendar size={16} />
            <span>Upcoming</span>
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'recent'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('recent')}
        >
          <div className="flex items-center space-x-2">
            <LogOut size={16} />
            <span>Recent Checkouts</span>
          </div>
        </button>
      </div>

      {renderBookings()}
    </div>
  );
}