import { apiClient, setAuthToken } from '../api/client';
import { Endpoints } from '../api/endpoints';
import { AuthResponse, LoginRequest, RegisterRequest, UserProfile, UserRole } from '../types/auth.types';

// Mock profiles for instant offline development and preview
const MOCK_USERS: Record<string, UserProfile> = {
  'adolescente@liberate.org': {
    id: 'usr-ado-01',
    name: 'Mateo González',
    email: 'adolescente@liberate.org',
    role: 'ADOLESCENTES',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAblkMVA0H49SglFfkUede6NktGZhBDacPtK_kF1Vgil42WOJCcweIKPl4eLY-Sakl-IWpL26Z64GNJ7NckD_9xKHGL8TZoCEdPSvWAUbGjzrY14Soi8MaxfWVWeAN_gb2s51t-Ghh9pf6VUabYwHJAX3J1XBE51XR5U_onDKcNG0NZ1uL6GFsR0TDUDBpWzumq4B6Gle8OBoFq0Z_iq1-oYWuu_KTKO3ZQoq-iX4vzuHoeOfxgsx7VGpabq8PJaDcpEXs',
  },
  'familia@liberate.org': {
    id: 'usr-fam-02',
    name: 'Familia Ramírez',
    email: 'familia@liberate.org',
    role: 'FAMILIAS',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyX_kF77Yt4zXO803bac2O2Vttasup6B35eJeu1ph4FehhUiE-9rhR4a9rpnD3RX3zHvIzMFejiNxewnku_Lw1O5kvCfvc2iBn_CJuOGlGEcxjQ_KCa8o51hHQBrKDv-AvzDH0DP5BPDYE3oVzWzNyB1hrw3bT4_9oWBKo39RmlRfZU6PtwrWHwHJVBKtFykKsucsXh16L67xf_uShBxHhTLWM0Ufd84SP0JjOGb_SKgeoWq9-u2KwS-wyluY9MyM5WGY',
  },
  'psicologo@liberate.org': {
    id: 'usr-psi-03',
    name: 'Dra. Sofía Morales',
    email: 'psicologo@liberate.org',
    role: 'PSICOLOGOS',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2nSWI389TCB9dEYtnPCx8So0R1JYhGR0rf-umTFbWjLpjvFs5R_cbB41lTnF9n_YOB2uVxqIRlmEh5c24g-_nF3tPrnv6EC-ubuyST6StOrCfbg4OuW0RyhoYsADMJe5Ox9qEqJxUPkeeX7RjAUmkwOljL96nLzFxecTRbdVT-8HazoOZZpuKKSQP2CoWWs7QLUTJVQThH0gzGrb4BsHFiOHwSCWBwUiBVRaaANdx9tdJn1RDVMufu9TUEG05V9rpzOE',
  },
};

export const AuthService = {
  /**
   * Authenticate user with Spring Boot backend (with mock fallback)
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(Endpoints.auth.login, request);
      setAuthToken(response.data.token);
      return response.data;
    } catch (err) {
      console.info('[AuthService] Backend unavailable, logging in with mock user.');
      // Generate realistic mock response
      const matchedUser = MOCK_USERS[request.email.toLowerCase()] || {
        id: `usr-${Date.now()}`,
        name: request.email.split('@')[0],
        email: request.email,
        role: request.role || 'ADOLESCENTES',
      };

      const mockResponse: AuthResponse = {
        token: `mock-jwt-token-${Date.now()}`,
        tokenType: 'Bearer',
        user: matchedUser,
      };

      setAuthToken(mockResponse.token);
      return mockResponse;
    }
  },

  /**
   * Register a new user with Spring Boot backend (with mock fallback)
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(Endpoints.auth.register, request);
      setAuthToken(response.data.token);
      return response.data;
    } catch (err) {
      console.info('[AuthService] Backend unavailable, creating mock registered user.');
      const mockResponse: AuthResponse = {
        token: `mock-jwt-token-reg-${Date.now()}`,
        tokenType: 'Bearer',
        user: {
          id: `usr-${Date.now()}`,
          name: request.name,
          email: request.email,
          role: request.role,
        },
      };

      setAuthToken(mockResponse.token);
      return mockResponse;
    }
  },

  /**
   * Log out user
   */
  async logout(): Promise<void> {
    setAuthToken(null);
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get<UserProfile>(Endpoints.auth.me);
      return response.data;
    } catch {
      return null;
    }
  },
};
