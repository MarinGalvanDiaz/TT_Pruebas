/**
 * Spring Boot Compatible DTOs & Types for Authentication
 */

export type UserRole = 'ADOLESCENTES' | 'FAMILIAS' | 'PSICOLOGOS' | 'ADMIN';

export interface RoleInfo {
  id: UserRole;
  label: string;
  description: string;
  avatarUrl?: string;
  iconName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  tokenType: string; // e.g. "Bearer"
  user: UserProfile;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
