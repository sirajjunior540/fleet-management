export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authUtils = {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },

  setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  },

  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    const accessToken = this.getAccessToken();
    if (accessToken) {
      defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };
    
    return fetch(fullUrl, config);
  },
};

export const authService = {
  ...authUtils,
  authenticatedFetch: authUtils.makeAuthenticatedRequest,
  
  async login(username: string, password: string) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to login';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse the error response, keep the original message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Store tokens
    if (data.access && data.refresh) {
      authUtils.setTokens({
        access: data.access,
        refresh: data.refresh
      });
    }
    
    return {
      user: data.user || { username },
      tokens: {
        access: data.access,
        refresh: data.refresh
      }
    };
  },
  
  async logout() {
    authUtils.clearTokens();
  },
};