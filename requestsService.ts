const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface MaintenanceRequest {
  id: number;
  subject: string;
  description?: string;
  maintenance_for: 'equipment' | 'work_center';
  equipment_id?: number;
  work_center_id?: number;
  requester_employee_id: number;
  assigned_team_id?: number;
  assigned_technician_id?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  maintenance_type?: 'corrective' | 'preventive';
  category?: string;
  request_date?: string;
  scheduled_date?: string;
  duration?: number;
  company?: string;
  due_date?: string;
  notes?: string;
  instructions?: string;
  created_at: string;
  updated_at: string;
  requester_name?: string;
  requester_email?: string;
  equipment_name?: string;
  work_center_name?: string;
}

export interface RequestFilters {
  status?: string;
  priority?: string;
  maintenance_for?: string;
  search?: string;
}

export interface ScheduledRequest {
  id: number;
  subject: string;
  scheduled_date: string;
  duration?: number;
  status: string;
  priority: string;
  maintenance_for: string;
  maintenance_type?: string;
  equipment_name?: string;
  work_center_name?: string;
  technician_name?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const requestsService = {
  // Get all requests with optional filters
  async getAllRequests(filters?: RequestFilters): Promise<MaintenanceRequest[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.maintenance_for) params.append('maintenance_for', filters.maintenance_for);
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/requests${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch requests');
      
      return data.data;
    } catch (error) {
      console.error('Get requests error:', error);
      throw error;
    }
  },

  // Get single request by ID
  async getRequestById(id: number): Promise<MaintenanceRequest> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch request');
      
      return data.data;
    } catch (error) {
      console.error('Get request error:', error);
      throw error;
    }
  },

  // Create new request
  async createRequest(requestData: {
    subject: string;
    description?: string;
    maintenance_for: 'equipment' | 'work_center';
    equipment_id?: number;
    work_center_id?: number;
    assigned_team_id?: number;
    assigned_technician_id?: number;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    maintenance_type?: 'corrective' | 'preventive';
    category?: string;
    request_date?: string;
    scheduled_date?: string;
    duration?: number;
    company?: string;
    due_date?: string;
    notes?: string;
    instructions?: string;
  }): Promise<MaintenanceRequest> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create request');
      
      return data.data;
    } catch (error) {
      console.error('Create request error:', error);
      throw error;
    }
  },

  // Update request
  async updateRequest(id: number, updates: Partial<MaintenanceRequest>): Promise<MaintenanceRequest> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update request');
      
      return data.data;
    } catch (error) {
      console.error('Update request error:', error);
      throw error;
    }
  },

  // Delete request
  async deleteRequest(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete request');
    } catch (error) {
      console.error('Delete request error:', error);
      throw error;
    }
  },

  // Get scheduled requests for calendar view
  async getScheduledRequests(start: string, end: string): Promise<ScheduledRequest[]> {
    try {
      const params = new URLSearchParams({ start, end });
      const url = `${API_BASE_URL}/api/requests/scheduled?${params.toString()}`;

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch scheduled requests');
      
      return data.data;
    } catch (error) {
      console.error('Get scheduled requests error:', error);
      throw error;
    }
  },
};
