import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { StaffStats } from './StaffStats';
import { createStaffUser } from '../../services/user.service';
import StaffTable from './StaffTable';

export function StaffManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffFormData, setStaffFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    phone: '',
    role: 'staff',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setStaffFormData({
      username: '',
      email: '',
      fullName: '',
      password: '',
      phone: '',
      role: 'staff',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaffFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Submitting data:', staffFormData);
      await createStaffUser(staffFormData);
      closeModal();
    } catch (err) {
      console.error('Error in creating staff user:', err);
      setError('Failed to create staff member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Staff Operations</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 text-sm md:text-lg rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            <Plus size={20} />
            <span>Add Staff</span>
          </button>
        </div>
      </div>

      <StaffStats />

      <div className="overflow-x-auto">
        <StaffTable />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={staffFormData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Staff username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={staffFormData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Staff email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={staffFormData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter Staff full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={staffFormData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter a secure password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone (Optional)</label>
                <input
                  type="text"
                  name="phone"
                  value={staffFormData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Enter Staff phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
