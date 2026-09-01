import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './endpoints';

// Token memory store (can be enhanced with SecureStore on mobile or localStorage on web)
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

/**
 * Configured Axios Instance for Spring Boot API
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors and handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      // Server returned an error response (e.g. 400, 401, 403, 500)
      console.warn(`[API Error ${error.response.status}]:`, error.response.data);
      if (error.response.status === 401) {
        setAuthToken(null);
      }
    } else if (error.request) {
      // Network error or backend unreachable (Spring Boot server not running yet)
      console.info('[API Network Info]: Spring Boot backend unreachable, using fallback mode.');
    }
    return Promise.reject(error);
  }
);
