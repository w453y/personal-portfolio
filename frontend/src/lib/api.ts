// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we have environment variables
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // Development vs Production detection
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // In development, connect directly to backend
    return 'http://localhost:3001';
  }
  
  // In production, use relative paths (assumes nginx proxy)
  return '';
};

const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 60000, // Increased to 60 seconds
};

console.log('API Configuration:', {
  baseUrl: API_CONFIG.BASE_URL,
  isDev: import.meta.env.DEV,
  env: import.meta.env.MODE,
  timeout: API_CONFIG.TIMEOUT
});

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  phone?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface HealthResponse {
  status: string;
  success: boolean;
}

export interface EmailValidationResponse {
  success: boolean;
  isValid: boolean;
  reason?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  redirect?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log('Making API request to:', url);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include', // Include cookies for session management
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      console.log('API Response:', {
        url,
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || response.statusText };
        }
        
        // Handle authentication errors
        if (response.status === 401 && errorData.redirect) {
          window.location.href = errorData.redirect;
          return { success: false, message: 'Authentication required' };
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error('API Request failed:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.makeRequest<HealthResponse>('/api/health');
      return response.data?.status === 'healthy' || response.success === true;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      return false;
    }
  }

  async validateEmail(email: string): Promise<EmailValidationResponse> {
    try {
      const response = await this.makeRequest<EmailValidationResponse>('/api/contact/validate-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      // Backend returns validation result directly at root level
      // Cast response as any to access properties
      const responseData = response as any;
      
      // Check if response has the expected validation properties at root level
      if (typeof responseData.isValid === 'boolean') {
        return {
          success: responseData.success || true,
          isValid: responseData.isValid,
          reason: responseData.reason
        };
      }
      
      // Fallback: check if it's nested in data property
      if (responseData.data && typeof responseData.data.isValid === 'boolean') {
        return {
          success: responseData.data.success || true,
          isValid: responseData.data.isValid,
          reason: responseData.data.reason
        };
      }
      
      return {
        success: false,
        isValid: false,
        reason: 'Invalid response format'
      };
    } catch (error) {
      console.warn('Email validation failed:', error);
      return {
        success: false,
        isValid: false,
        reason: 'Validation service unavailable'
      };
    }
  }

  async submitContactForm(data: ContactFormData): Promise<ApiResponse> {
    return this.makeRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      }),
    });
  }

  // Authentication methods
  async checkAuth(): Promise<boolean> {
    try {
      const response = await this.makeRequest<AuthResponse>('/auth/check');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const authHeader = btoa(`${username}:${password}`);
    return this.makeRequest<AuthResponse>('/auth/login', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authHeader}`
      }
    });
  }

  async logout(): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/logout', {
      method: 'GET'
    });
  }

  // Admin API methods (protected by session cookies)
  async getContacts(page: number = 1, limit: number = 20): Promise<ApiResponse> {
    return this.makeRequest(`/api/contact?page=${page}&limit=${limit}`);
  }

  async getContact(id: number): Promise<ApiResponse> {
    return this.makeRequest(`/api/contact/${id}`);
  }

  async markContactAsRead(id: number): Promise<ApiResponse> {
    return this.makeRequest(`/api/contact/${id}/read`, {
      method: 'PATCH'
    });
  }

  async replyToContact(id: number, replyMessage: string): Promise<ApiResponse> {
    return this.makeRequest(`/api/contact/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyMessage })
    });
  }

  async deleteContact(id: number): Promise<ApiResponse> {
    return this.makeRequest(`/api/contact/${id}`, {
      method: 'DELETE'
    });
  }

  async getConversations(): Promise<ApiResponse> {
    return this.makeRequest('/api/admin/conversations');
  }

  async getConversation(contactId: number): Promise<ApiResponse> {
    return this.makeRequest(`/api/admin/conversations/${contactId}`);
  }

  async getGmailStatus(): Promise<ApiResponse> {
    return this.makeRequest('/api/admin/gmail/status');
  }
}

export const apiService = new ApiService();

// Backward compatibility exports
export const checkBackendHealth = () => apiService.checkHealth();
export const validateEmail = (email: string) => apiService.validateEmail(email);
export const submitContactForm = (data: ContactFormData) => apiService.submitContactForm(data);

// New exports for authentication and admin features
export const checkAuth = () => apiService.checkAuth();
export const login = (username: string, password: string) => apiService.login(username, password);
export const logout = () => apiService.logout();
export const getContacts = (page?: number, limit?: number) => apiService.getContacts(page, limit);
export const getContact = (id: number) => apiService.getContact(id);
export const markContactAsRead = (id: number) => apiService.markContactAsRead(id);
export const replyToContact = (id: number, replyMessage: string) => apiService.replyToContact(id, replyMessage);
export const deleteContact = (id: number) => apiService.deleteContact(id);
export const getConversations = () => apiService.getConversations();
export const getConversation = (contactId: number) => apiService.getConversation(contactId);
export const getGmailStatus = () => apiService.getGmailStatus();