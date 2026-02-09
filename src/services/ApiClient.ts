import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Config } from '@/constants/config';

const SESSION_KEY = 'byte_session';
const COOKIE_NAME = 'tasktracker_session';

/**
 * Resolve API base URL. On Android emulator, localhost must be 10.0.2.2
 * to reach the host machine.
 */
function getApiBaseUrl(): string {
  let base = Config.apiBaseUrl;
  if (Platform.OS === 'android' && (base.includes('localhost') || base.includes('127.0.0.1'))) {
    base = base.replace(/localhost|127\.0\.0\.1/, '10.0.2.2');
  }
  return base;
}

class ApiClient {
  private baseUrl: string = getApiBaseUrl();

  async getSession(): Promise<string | null> {
    return await SecureStore.getItemAsync(SESSION_KEY);
  }

  async setSession(session: string): Promise<void> {
    await SecureStore.setItemAsync(SESSION_KEY, session);
  }

  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const session = await this.getSession();
    
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    
    if (session) {
      // Send as Cookie header
      headers.set('Cookie', `${COOKIE_NAME}=${session}`);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Optional: Handle unauthorized (e.g., clear session)
    }

    return response;
  }

  async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch(endpoint: string, body: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
