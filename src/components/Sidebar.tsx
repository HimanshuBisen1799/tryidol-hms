import React, { useEffect, useState } from 'react';

import {
  LayoutDashboard,
  CalendarCheck2,
  Users,
  UserCog,
  Utensils,
  BedDouble,
  FileBarChart,
  Settings,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const menuItems = [
  { icon: LayoutDashboard, text: 'Dashboard', id: 'dashboard' },
  { icon: CalendarCheck2, text: 'Bookings', id: 'bookings' },
  { icon: Users, text: 'Guests', id: 'guests' },
  { icon: UserCog, text: 'Staff', id: 'staff' },
  { icon: Utensils, text: 'RoomManagement', id: 'RoomManagement' },
  { icon: BedDouble, text: 'Housekeeping', id: 'housekeeping' },
  { icon: FileBarChart, text: 'Reports', id: 'reports' },
  { icon: Settings, text: 'Settings', id: 'settings' },
];

export function Sidebar({ onNavigate, currentPage }: SidebarProps) {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (userData) {
      setUser(userData);
    }
  }, []);
  const handleLogout = () => {
    // Remove user from local storage
    localStorage.removeItem('user');
    console.log('User logged out');

    // Refresh the page
    window.location.reload();
  };

  return (
    <div className='md:h-full   sticky '>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-[#2B428C] text-white rounded-md"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 bg-[#2B428C]  min-h-screen text-white p-4 transition-transform z-30 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:block`}
      >
        <div className="flex justify-between   items-center mb-8 px-4 lg:mb-4">
          <div className="text-2xl font-bold">HMS</div>
          {/* Close Button for Mobile */}
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="space-y-2 ">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false); // Close sidebar after navigation on mobile
              }}
              className={`w-full h-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-blue-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.text}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-8 left-4 mb-2 flex items-center space-x-3 px-4">
          <div className="w-10 h-10 bg-blue-400 mb-9 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium">{user?.username || 'Guest'}</div>
            <div className="text-xs text-gray-300">{user?.email || 'guest@hotel.com'}</div>
            <div className='ml-6 mb-[-1vw]  w-full'> <button className="border-2 border-red-400 rounded-full  px-3 py-1 ml-9 mt-4 text- cursor-pointer hover:bg-red-600 hover:text-red-200"
           onClick={handleLogout}
            >log-out</button></div>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
