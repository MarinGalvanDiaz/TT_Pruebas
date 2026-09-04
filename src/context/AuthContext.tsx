import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  LoginRequest,
  RegisterRequest,
  GoogleLoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
} from '../types/auth.types';
import { AuthService } from '../services/auth.service';
import { SecureTokenStorage } from '../services/secureStore';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  isLoading: boolean;
  error: string | null;
  login: (req: LoginRequest) => Promise<boolean>;
  register: (req: RegisterRequest) => Promise<boolean>;
  loginWithGoogle: (req: GoogleLoginRequest) => Promise<boolean>;
  forgotPassword: (req: ForgotPasswordRequest) => Promise<ApiResponse>;
  resetPassword: (req: ResetPasswordRequest) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADOLESCENTES');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    // Check existing stored session on startup
    const checkSession = async () => {
      try {
        const storedRefreshToken = await SecureTokenStorage.getRefreshToken();
        if (storedRefreshToken) {
          const profile = await AuthService.getCurrentUser();
          if (profile) {
            setUser(profile);
            if (profile.role) {
              setSelectedRole(profile.role);
            }
          }
        }
      } catch (e) {
        console.log('[AuthContext] No active session found');
      }
    };
    checkSession();
  }, []);

  const login = async (req: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({ ...req, role: req.role || selectedRole });
      const activeToken = response.accessToken || response.token || '';
      setUser(response.user);
      setToken(activeToken);
      if (response.user.role) {
        setSelectedRole(response.user.role);
      }
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Credenciales inválidas. Por favor verifica tu información.';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (req: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.register({ ...req, role: selectedRole });
      const activeToken = response.accessToken || response.token || '';
      setUser(response.user);
      setToken(activeToken);
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Error al registrarse. Por favor verifica que los datos sean correctos.';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (req: GoogleLoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.loginWithGoogle({ ...req, role: req.role || selectedRole });
      const activeToken = response.accessToken || response.token || '';
      setUser(response.user);
      setToken(activeToken);
      if (response.user.role) {
        setSelectedRole(response.user.role);
      }
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Error al autenticar con Google. Inténtalo nuevamente.';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (req: ForgotPasswordRequest): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await AuthService.forgotPassword(req);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Error al procesar la solicitud.';
      setError(message);
      return { success: false, message, code: 'ERROR' };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (req: ResetPasswordRequest): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await AuthService.resetPassword(req);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Error al restablecer contraseña.';
      setError(message);
      return { success: false, message, code: 'ERROR' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAll = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.logoutAll();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        selectedRole,
        setSelectedRole,
        isLoading,
        error,
        login,
        register,
        loginWithGoogle,
        forgotPassword,
        resetPassword,
        logout,
        logoutAll,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

