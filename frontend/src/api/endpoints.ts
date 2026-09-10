export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';

export const Endpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    google: `${API_BASE_URL}/auth/google`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    logout: `${API_BASE_URL}/auth/logout`,
    logoutAll: `${API_BASE_URL}/auth/logout-all`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    resendVerification: `${API_BASE_URL}/auth/resend-verification`,
    me: `${API_BASE_URL}/auth/me`,
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
  tutorFlow: {
    invite: `${API_BASE_URL}/tutor-flow/invite`,
    resend: `${API_BASE_URL}/tutor-flow/resend`,
    status: (token: string) => `${API_BASE_URL}/tutor-flow/status/${token}`,
    confirmData: `${API_BASE_URL}/tutor-flow/confirm-data`,
    consent: `${API_BASE_URL}/tutor-flow/consent`,
    blockA: `${API_BASE_URL}/tutor-flow/block-a`,
    blockB: `${API_BASE_URL}/tutor-flow/block-b`,
    symptoms: `${API_BASE_URL}/tutor-flow/symptoms`,
    complete: `${API_BASE_URL}/tutor-flow/complete`,
    sendDirectory: `${API_BASE_URL}/tutor-flow/send-directory`,
  },
} as const;

