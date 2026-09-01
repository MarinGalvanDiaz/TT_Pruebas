/**
 * Spring Boot Backend API Endpoints
 * Base URL defaults to http://localhost:8080 or can be configured via environment variable
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const Endpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`,
    refreshToken: `${API_BASE_URL}/auth/refresh-token`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  },
  users: {
    profile: `${API_BASE_URL}/users/profile`,
    updateRole: `${API_BASE_URL}/users/role`,
  },
  content: {
    faqs: `${API_BASE_URL}/content/faqs`,
    testimonials: `${API_BASE_URL}/content/testimonials`,
    partners: `${API_BASE_URL}/content/partners`,
  },
  exercises: {
    list: `${API_BASE_URL}/exercises`,
    byId: (id: string) => `${API_BASE_URL}/exercises/${id}`,
  },
  progress: {
    moodLogs: `${API_BASE_URL}/progress/mood-logs`,
    summary: `${API_BASE_URL}/progress/summary`,
  },
} as const;
