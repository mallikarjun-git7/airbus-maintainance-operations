const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface WorkCenter {
  id: number;
  name: string;
  code: string;
  tag?: string;
  alternative_workcenters?: string;
  cost_per_hour: number;
  capacity: number;
  time_efficiency: number;
  oee_target: number;
  created_at: string;
  updated_at: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const workCentersService = {
  // Get all work centers with optional search
  async getAllWorkCenters(search?: string): Promise<WorkCenter[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/work-centers${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch work centers');
      
      return data.data;
    } catch (error) {
      console.error('Get work centers error:', error);
      throw error;
    }
  },

  // Get single work center by ID
  async getWorkCenterById(id: number): Promise<WorkCenter> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/work-centers/${id}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch work center');
      
      return data.data;
    } catch (error) {
      console.error('Get work center error:', error);
      throw error;
    }
  },

  // Create new work center
  async createWorkCenter(workCenterData: {
    name: string;
    code: string;
    tag?: string;
    alternative_workcenters?: string;
    cost_per_hour?: number;
    capacity?: number;
    time_efficiency?: number;
    oee_target?: number;
  }): Promise<WorkCenter> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/work-centers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(workCenterData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create work center');
      
      return data.data;
    } catch (error) {
      console.error('Create work center error:', error);
      throw error;
    }
  },

  // Update work center
  async updateWorkCenter(id: number, updates: Partial<WorkCenter>): Promise<WorkCenter> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/work-centers/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update work center');
      
      return data.data;
    } catch (error) {
      console.error('Update work center error:', error);
      throw error;
    }
  },

  // Delete work center
  async deleteWorkCenter(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/work-centers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete work center');
    } catch (error) {
      console.error('Delete work center error:', error);
      throw error;
    }
  },
};
