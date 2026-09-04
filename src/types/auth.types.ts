/**
 * Spring Boot Compatible DTOs & Types for Authentication & Security
 */

export type UserRole = 'ADOLESCENTES' | 'FAMILIAS' | 'PSICOLOGOS' | 'ADMIN';

export type AuthProviderType = 'LOCAL' | 'GOOGLE' | 'APPLE' | 'GITHUB' | 'FACEBOOK';

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
  emailVerified?: boolean;
  providers?: AuthProviderType[];
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

export interface GoogleLoginRequest {
  idToken: string;
  role?: UserRole;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string; // e.g. "Bearer"
  expiresIn?: number;
  user: UserProfile;
  // Legacy alias support
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  timestamp?: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  code: string;
  timestamp?: string;
  status?: number;
}

