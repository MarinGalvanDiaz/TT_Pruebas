import { apiClient, setAuthToken } from '../api/client';
import { Endpoints } from '../api/endpoints';
import { SecureTokenStorage } from './secureStore';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  GoogleLoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserProfile,
  ApiResponse,
} from '../types/auth.types';

// Mock profiles for instant offline development and preview
const MOCK_USERS: Record<string, UserProfile> = {
  'adolescente@liberate.org': {
    id: 'usr-ado-01',
    name: 'Mateo González',
    email: 'adolescente@liberate.org',
    role: 'ADOLESCENTES',
    emailVerified: true,
    providers: ['LOCAL'],
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAblkMVA0H49SglFfkUede6NktGZhBDacPtK_kF1Vgil42WOJCcweIKPl4eLY-Sakl-IWpL26Z64GNJ7NckD_9xKHGL8TZoCEdPSvWAUbGjzrY14Soi8MaxfWVWeAN_gb2s51t-Ghh9pf6VUabYwHJAX3J1XBE51XR5U_onDKcNG0NZ1uL6GFsR0TDUDBpWzumq4B6Gle8OBoFq0Z_iq1-oYWuu_KTKO3ZQoq-iX4vzuHoeOfxgsx7VGpabq8PJaDcpEXs',
  },
  'familia@liberate.org': {
    id: 'usr-fam-02',
    name: 'Familia Ramírez',
    email: 'familia@liberate.org',
    role: 'FAMILIAS',
    emailVerified: true,
    providers: ['LOCAL'],
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyX_kF77Yt4zXO803bac2O2Vttasup6B35eJeu1ph4FehhUiE-9rhR4a9rpnD3RX3zHvIzMFejiNxewnku_Lw1O5kvCfvc2iBn_CJuOGlGEcxjQ_KCa8o51hHQBrKDv-AvzDH0DP5BPDYE3oVzWzNyB1hrw3bT4_9oWBKo39RmlRfZU6PtwrWHwHJVBKtFykKsucsXh16L67xf_uShBxHhTLWM0Ufd84SP0JjOGb_SKgeoWq9-u2KwS-wyluY9MyM5WGY',
  },
  'psicologo@liberate.org': {
    id: 'usr-psi-03',
    name: 'Dra. Sofía Morales',
    email: 'psicologo@liberate.org',
    role: 'PSICOLOGOS',
    emailVerified: true,
    providers: ['LOCAL'],
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2nSWI389TCB9dEYtnPCx8So0R1JYhGR0rf-umTFbWjLpjvFs5R_cbB41lTnF9n_YOB2uVxqIRlmEh5c24g-_nF3tPrnv6EC-ubuyST6StOrCfbg4OuW0RyhoYsADMJe5Ox9qEqJxUPkeeX7RjAUmkwOljL96nLzFxecTRbdVT-8HazoOZZpuKKSQP2CoWWs7QLUTJVQThH0gzGrb4BsHFiOHwSCWBwUiBVRaaANdx9tdJn1RDVMufu9TUEG05V9rpzOE',
  },
};

export const AuthService = {
  /**
   * Traditional Login with Email and Password
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(Endpoints.auth.login, request);
      const token = response.data.accessToken || response.data.token || null;
      setAuthToken(token);
      if (response.data.refreshToken) {
        await SecureTokenStorage.saveRefreshToken(response.data.refreshToken);
      }
      return response.data;
    } catch (err: any) {
      if (err.response) {
        // Backend actively responded with error (e.g. 401, 400, 429)
        throw err;
      }

      console.info('[AuthService] Backend unreachable, logging in with mock user.');
      const matchedUser = MOCK_USERS[request.email.toLowerCase()] || {
        id: `usr-${Date.now()}`,
        name: request.email.split('@')[0],
        email: request.email,
        role: request.role || 'ADOLESCENTES',
        emailVerified: true,
        providers: ['LOCAL'],
      };

      const mockResponse: AuthResponse = {
        accessToken: `mock-jwt-access-${Date.now()}`,
        refreshToken: `mock-jwt-refresh-${Date.now()}`,
        token: `mock-jwt-access-${Date.now()}`,
        tokenType: 'Bearer',
        user: matchedUser,
      };

      setAuthToken(mockResponse.accessToken);
      await SecureTokenStorage.saveRefreshToken(mockResponse.refreshToken!);
      return mockResponse;
    }
  },

  /**
   * Traditional Register with Name, Email, Password and Role
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    try {
      const payload = {
        ...request,
        nombre: request.nombre || request.name,
      };
      const response = await apiClient.post<AuthResponse>(Endpoints.auth.register, payload);
      const token = response.data.accessToken || response.data.token || null;
      setAuthToken(token);
      if (response.data.refreshToken) {
        await SecureTokenStorage.saveRefreshToken(response.data.refreshToken);
      }
      return response.data;
    } catch (err: any) {
      if (err.response) {
        throw err;
      }

      console.info('[AuthService] Backend unreachable, creating mock registered user.');
      const mockResponse: AuthResponse = {
        accessToken: `mock-jwt-reg-${Date.now()}`,
        refreshToken: `mock-refresh-reg-${Date.now()}`,
        token: `mock-jwt-reg-${Date.now()}`,
        tokenType: 'Bearer',
        user: {
          id: `usr-${Date.now()}`,
          name: request.name,
          email: request.email,
          role: request.role,
          emailVerified: false,
          providers: ['LOCAL'],
        },
      };

      setAuthToken(mockResponse.accessToken);
      await SecureTokenStorage.saveRefreshToken(mockResponse.refreshToken!);
      return mockResponse;
    }
  },

  /**
   * Authenticate with Google ID Token
   */
  async loginWithGoogle(request: GoogleLoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(Endpoints.auth.google, request);
      const token = response.data.accessToken || response.data.token || null;
      setAuthToken(token);
      if (response.data.refreshToken) {
        await SecureTokenStorage.saveRefreshToken(response.data.refreshToken);
      }
      return response.data;
    } catch (err: any) {
      if (err.response) {
        throw err;
      }

      console.info('[AuthService] Backend unreachable, logging in with mock Google profile.');
      const mockResponse: AuthResponse = {
        accessToken: `mock-google-jwt-${Date.now()}`,
        refreshToken: `mock-google-refresh-${Date.now()}`,
        token: `mock-google-jwt-${Date.now()}`,
        tokenType: 'Bearer',
        user: {
          id: `usr-g-${Date.now()}`,
          name: 'Usuario Google',
          email: 'usuario.google@gmail.com',
          role: request.role || 'ADOLESCENTES',
          emailVerified: true,
          providers: ['GOOGLE'],
        },
      };

      setAuthToken(mockResponse.accessToken);
      await SecureTokenStorage.saveRefreshToken(mockResponse.refreshToken!);
      return mockResponse;
    }
  },

  /**
   * Request Password Reset Link / Token
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(Endpoints.auth.forgotPassword, request);
      return response.data;
    } catch (err: any) {
      if (err.response?.data) {
        return err.response.data;
      }
      return {
        success: true,
        message: 'Si el correo está registrado, recibirás un enlace de recuperación en breve.',
      };
    }
  },

  /**
   * Reset Password with Token
   */
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(Endpoints.auth.resetPassword, request);
      return response.data;
    } catch (err: any) {
      if (err.response?.data) {
        throw err;
      }
      return {
        success: true,
        message: 'Contraseña actualizada con éxito.',
      };
    }
  },

  /**
   * Verify email address using token / 6-digit code
   */
  async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(Endpoints.auth.verifyEmail, { token: token.trim() });
      return response.data;
    } catch (err: any) {
      if (err.response?.data) {
        return err.response.data;
      }
      throw err;
    }
  },

  /**
   * Resend email verification code
   */
  async resendVerification(email: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(Endpoints.auth.resendVerification, { email: email.trim().toLowerCase() });
      return response.data;
    } catch (err: any) {
      if (err.response?.data) {
        return err.response.data;
      }
      throw err;
    }
  },

  /**
   * Log out current session
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = await SecureTokenStorage.getRefreshToken();
      if (refreshToken) {
        await apiClient.post(Endpoints.auth.logout, { refreshToken }).catch(() => {});
      }
    } finally {
      setAuthToken(null);
      await SecureTokenStorage.clearAll();
    }
  },

  /**
   * Log out all active sessions
   */
  async logoutAll(): Promise<void> {
    try {
      await apiClient.post(Endpoints.auth.logoutAll).catch(() => {});
    } finally {
      setAuthToken(null);
      await SecureTokenStorage.clearAll();
    }
  },

  /**
   * Get current authenticated user profile
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

