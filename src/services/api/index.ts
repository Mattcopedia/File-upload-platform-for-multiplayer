import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

import { APP_ROUTES } from '@/constants';

// Create an axios instance with custom config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    // Check for session errors and handle them
    if (session?.error) {
      if (session.error === 'RefreshTokenExpired' || session.error === 'RefreshAccessTokenError') {
        await signOut({ callbackUrl: APP_ROUTES.AUTH_LOGIN });
        return Promise.reject(new Error('Session expired'));
      }
    }

    if (session?.access_token) {
      config.headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Force session refresh by getting a new session
        const session = await getSession();

        // Check if session has errors after refresh attempt
        if (session?.error) {
          if (
            session.error === 'RefreshTokenExpired' ||
            session.error === 'RefreshAccessTokenError'
          ) {
            await signOut({ callbackUrl: APP_ROUTES.AUTH_LOGIN });
            return Promise.reject(error);
          }
        }

        if (session?.access_token) {
          // Update the authorization header with the refreshed token
          originalRequest.headers.set('Authorization', `Bearer ${session.access_token}`);
          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          // No access token available, sign out
          await signOut({ callbackUrl: APP_ROUTES.AUTH_LOGIN });
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If anything fails during refresh, sign out
        await signOut({ callbackUrl: APP_ROUTES.AUTH_LOGIN });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
