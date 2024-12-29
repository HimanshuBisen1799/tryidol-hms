import api from './api';

interface Task {
  room_number: number;
  bed_number: string;
  task: string;
  shift?: string;
  task_status?: string;
  completion_date?: Date;
}

export interface CreateHousekeepingRequest {
  staff_id: string;
  tasks: Task[];
}

export interface UpdateTaskStatusRequest {
  task_status: string;
  completion_date?: Date;
}

export const HousekeepingService = {
  /**
   * Creates housekeeping tasks for a specific staff member.
   * @param data - The request data containing staff_id and tasks array.
   */
  createHousekeepingTasks: async (data: CreateHousekeepingRequest) => {
    try {
      const response = await api.post('/housekeping', data);
      return response.data;
    } catch (error) {
      console.error('Error creating housekeeping tasks:', error);
      throw error;
    }
  },

  /**
   * Updates the status of a specific housekeeping task.
   * @param taskId - The ID of the task to update.
   * @param data - The request data containing the new status and optional completion date.
   */
  updateTaskStatus: async (taskId: string, data: UpdateTaskStatusRequest) => {
    try {
      const response = await api.put(`/housekeping/${taskId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating housekeeping task status:', error);
      throw error;
    }
  },

  /**
   * Fetches all housekeeping tasks for a specific staff member, optionally filtering by task status.
   * @param staffId - The ID of the staff member.
   * @param task_status - Optional query parameter to filter tasks by status.
   */
  getAllHousekeepingTasks: async (staffId: string, task_status?: string) => {
    try {
      const params = task_status ? { task_status } : {};
      const response = await api.get(`/housekeping/${staffId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching housekeeping tasks:', error);
      throw error;
    }
  },
};
