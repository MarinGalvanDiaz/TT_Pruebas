import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { Endpoints } from './endpoints';
import { SecureTokenStorage } from '../services/secureStore';
import { AuthResponse } from '../types/auth.types';

// Initialize from sessionStorage on web so page reloads keep the active JWT immediately
let memoryAccessToken: string | null = SecureTokenStorage.getAccessTokenSync();
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setAuthToken = (token: string | null) => {
  memoryAccessToken = token;
  SecureTokenStorage.saveAccessTokenSync(token);
};

export const getAuthToken = (): string | null => {
  if (!memoryAccessToken) {
    memoryAccessToken = SecureTokenStorage.getAccessTokenSync();
  }
  return memoryAccessToken;
};

/**
 * Configured Axios Instance for Spring Boot API
 * Note: Endpoints already include API_BASE_URL, so baseURL is omitted here to prevent URL duplication.
 */
export const apiClient: AxiosInstance = axios.create({
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Access Token & sanitize URLs
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Safeguard: sanitize if a double /api/api/ was inadvertently formed
    if (config.url && config.url.includes('/api/api/')) {
      config.url = config.url.replace(/\/api\/api\//g, '/api/');
    }
    const activeToken = getAuthToken();
    if (activeToken && config.headers) {
      config.headers.Authorization = `Bearer ${activeToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Transparent Refresh Token Rotation & Retry
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on auth endpoints (login, register, refresh itself)
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/google') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue concurrent requests while token is being refreshed
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureTokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call backend refresh endpoint with raw Axios to bypass interceptors
        const refreshResponse = await axios.post<AuthResponse>(
          Endpoints.auth.refresh,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAccessToken = refreshResponse.data.accessToken || refreshResponse.data.token || null;
        const newRefreshToken = refreshResponse.data.refreshToken;

        setAuthToken(newAccessToken);
        if (newRefreshToken) {
          await SecureTokenStorage.saveRefreshToken(newRefreshToken);
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAuthToken(null);
        await SecureTokenStorage.clearAll();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
