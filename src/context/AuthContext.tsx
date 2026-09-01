import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, LoginRequest, RegisterRequest } from '../types/auth.types';
import { AuthService } from '../services/auth.service';

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
  logout: () => Promise<void>;
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

  const login = async (req: LoginRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({ ...req, role: req.role || selectedRole });
      setUser(response.user);
      setToken(response.token);
      if (response.user.role) {
        setSelectedRole(response.user.role);
      }
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al iniciar sesión. Inténtalo nuevamente.');
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
      setUser(response.user);
      setToken(response.token);
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al registrarse. Inténtalo nuevamente.');
      return false;
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
        logout,
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
