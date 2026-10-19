// Authentication Service - API integration with backend
// This service handles all authentication-related API calls

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    token_type: string;
    user: UserRecord & { is_active?: boolean };
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserRecord;
    access_token: string;
    token_type: string;
  };
}

const CURRENT_USER_KEY = 'gearguard_current_user';

export const mockAuthService = {
  // Register a new user
  async register({ name, email, password }: { name: string; email: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      if (data.data) {
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.data.user));
      }

      return data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login with email and password
  async login({ email, password }: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        // Return exact error messages from backend: "Account not exist" or "Invalid Password"
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      if (data.data) {
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ 
          id: data.data.user.id, 
          email: data.data.user.email, 
          name: data.data.user.name 
        }));
      }

      return data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  },

  // Get current user
  getCurrentUser() {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Get current user from API (with token verification)
  async getCurrentUserFromAPI() {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token');
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user data');
      }

      // Update stored user data
      if (data.data) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.data));
      }

      return data.data;
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is invalid, clear storage
      this.logout();
      throw error;
    }
  }
};

export default mockAuthService;


// Named export for convenience (pages import `mockAuth`)
export const mockAuth = mockAuthService;
