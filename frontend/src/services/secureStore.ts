import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'liberate_auth_refresh_token';
const ACCESS_TOKEN_KEY = 'liberate_auth_access_token';

// In-memory fallback for web environment
let inMemoryStore: Record<string, string | null> = {
  [REFRESH_TOKEN_KEY]: null,
  [ACCESS_TOKEN_KEY]: null,
};

export const SecureTokenStorage = {
  /**
   * Save refresh token securely
   */
  async saveRefreshToken(token: string): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
      } else {
        inMemoryStore[REFRESH_TOKEN_KEY] = token;
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
        }
      }
    } catch (error) {
      console.warn('[SecureStorage] Error saving refresh token:', error);
      inMemoryStore[REFRESH_TOKEN_KEY] = token;
    }
  },

  /**
   * Retrieve stored refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      if (Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      } else {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          return window.sessionStorage.getItem(REFRESH_TOKEN_KEY) || inMemoryStore[REFRESH_TOKEN_KEY];
        }
        return inMemoryStore[REFRESH_TOKEN_KEY];
      }
    } catch (error) {
      console.warn('[SecureStorage] Error getting refresh token:', error);
      return inMemoryStore[REFRESH_TOKEN_KEY];
    }
  },

  /**
   * Remove stored refresh token (on logout)
   */
  async removeRefreshToken(): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      } else {
        inMemoryStore[REFRESH_TOKEN_KEY] = null;
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      }
    } catch (error) {
      console.warn('[SecureStorage] Error removing refresh token:', error);
      inMemoryStore[REFRESH_TOKEN_KEY] = null;
    }
  },

  /**
   * Clear all stored authentication tokens
   */
  async clearAll(): Promise<void> {
    await this.removeRefreshToken();
    inMemoryStore = {};
  },
};
