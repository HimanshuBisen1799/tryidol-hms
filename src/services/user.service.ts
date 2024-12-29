import api from './api';  // Import the API instance you've already configured

// Define the interface for User type
export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
}

// Register a new user
export const registerUser = async (userData: {
  username: string;
  email: string;
  fullName: string;
  password: string;
  phone?: string;
}) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;  // Return the response data after successful registration
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to register user');
  }
};

// Login user
export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/user/login', credentials);
    return response.data;  // Return the login response (e.g., token)
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user/user');
    return response.data;  // Return current user data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch current user');
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/user/all');
    return response.data;  // Return list of all users
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// Get users by role
export const getAllUsersByRole = async (role: string) => {
  try {
    const response = await api.get(`/users/all/role?role=${role}`);
    
    console.log(response.data);
    return response.data;  // Return users filtered by role
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch users with role ${role}`);
  }
};

// Get user by ID
export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;  // Return user data by ID
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to fetch user with ID ${userId}`);
  }
};

// Update user by ID
export const updateUser = async (userId: string, updatedData: Partial<User>) => {
  try {
    const response = await api.put(`/user/${userId}`, updatedData);
    return response.data;  // Return updated user data
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to update user with ID ${userId}`);
  }
};

// Delete user by ID
export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/user/${userId}`);
    return response.data;  // Return success message after deleting
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to delete user with ID ${userId}`);
  }
};

// Create a staff user (Admin only)
export const createStaffUser = async (staffData: {
  username: string;
  email: string;
  fullName: string;
  password: string;
  phone?: string;
}) => {
  try {
    const response = await api.post('/users/staff', staffData);
    return response.data;  // Return created staff user data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create staff user');
  }
};
