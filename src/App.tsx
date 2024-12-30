import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Sidebar } from './components/Sidebar';
import { BookingManagement } from './components/bookings/BookingManagement';
import { Dashboard } from './components/dashboard/Dashboard';
import { GuestManagement } from './components/guests/GuestManagement';
import { StaffManagement } from './components/staff/StaffManagement';
import { HousekeepingManagement } from './components/housekeeping/HousekeepingManagement';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { RoomManagement } from './components/rooms/RoomManagement';

// dashboard

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(localStorage.getItem('currentPage') || 'dashboard');

  // Function to handle navigation
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page); // Persist page selection in localStorage
  };

  useEffect(() => {
    // Check if the user is authenticated
    if (!user && !isLoading) {
      // Redirect to login if no user and not loading
      window.location.href = '/login'; // or you can use react-router for routing
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar Component */}
      <div className="lg:w-64   md:w-24  md:h-screen w-0  md:shadow-md md:overflow-y-auto absolute md:fixed">
        <Sidebar onNavigate={handleNavigate} currentPage={currentPage} />
      </div>

      {/* Page Content */}
      <div className="flex-1   md:ml-64 ml-10  bg-transparent p-8 overflow-y-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'bookings' && <BookingManagement />}
        {currentPage === 'guests' && <GuestManagement />}
        {currentPage === 'staff' && <StaffManagement />}
        {currentPage === 'RoomManagement' && <RoomManagement />}
        {currentPage === 'housekeeping' && <HousekeepingManagement />}
        {currentPage === 'reports' && <ReportsAnalytics />}
        {currentPage === 'settings' && <h1>Settings Content</h1>}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
