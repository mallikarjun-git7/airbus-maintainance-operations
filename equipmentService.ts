const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface Equipment {
  id: number;
  name: string;
  category?: string;
  type: 'machine' | 'vehicle' | 'computer' | 'other';
  owner_department?: string;
  owner_employee_id?: number;
  technician_id?: number;
  location?: string;
  serial_no?: string;
  vendor?: string;
  warranty_start?: string;
  warranty_end?: string;
  assigned_date?: string;
  work_center_id?: number;
  company?: string;
  health_percent: number;
  attachments_metadata?: string;
  created_at: string;
  updated_at: string;
  owner_name?: string;
  owner_email?: string;
  technician_name?: string;
  work_center_name?: string;
}

export interface EquipmentFilters {
  type?: string;
  search?: string;
  health_threshold?: number;
}

interface EquipmentStats {
  total: number;
  critical: number;
  byType: { type: string; count: number }[];
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export type { Equipment };

export const equipmentService = {
  // Get all equipment with optional filters
  async getAllEquipment(filters?: EquipmentFilters): Promise<Equipment[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.health_threshold) params.append('health_threshold', filters.health_threshold.toString());

      const queryString = params.toString();
      const url = `${API_BASE_URL}/api/equipment${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch equipment');
      
      return data.data;
    } catch (error) {
      console.error('Get equipment error:', error);
      throw error;
    }
  },

  // Get single equipment by ID
  async getEquipmentById(id: number): Promise<Equipment> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/equipment/${id}`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch equipment');
      
      return data.data;
    } catch (error) {
      console.error('Get equipment error:', error);
      throw error;
    }
  },

  // Create new equipment
  async createEquipment(equipmentData: {
    name: string;
    type?: 'machine' | 'vehicle' | 'computer' | 'other';
    owner_department?: string;
    owner_employee_id?: number;
    location?: string;
    serial_no?: string;
    vendor?: string;
    warranty_start?: string;
    warranty_end?: string;
    health_percent?: number;
    attachments_metadata?: string;
  }): Promise<Equipment> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/equipment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(equipmentData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create equipment');
      
      return data.data;
    } catch (error) {
      console.error('Create equipment error:', error);
      throw error;
    }
  },

  // Update equipment
  async updateEquipment(id: number, updates: Partial<Equipment>): Promise<Equipment> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/equipment/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update equipment');
      
      return data.data;
    } catch (error) {
      console.error('Update equipment error:', error);
      throw error;
    }
  },

  // Delete equipment
  async deleteEquipment(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/equipment/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete equipment');
    } catch (error) {
      console.error('Delete equipment error:', error);
      throw error;
    }
  },

  // Get equipment statistics (for dashboard KPI)
  async getEquipmentStats(): Promise<EquipmentStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/equipment/stats`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch equipment stats');
      
      return data.data;
    } catch (error) {
      console.error('Get equipment stats error:', error);
      throw error;
    }
  },

  // Mark equipment as scrapped
  async scrapEquipment(id: number, reason?: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/equipment/${id}/scrap`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to scrap equipment');
    } catch (error) {
      console.error('Scrap equipment error:', error);
      throw error;
    }
  },
};
