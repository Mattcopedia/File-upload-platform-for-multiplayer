import { JWT } from 'next-auth/jwt';

import { API_ROUTES } from '@/constants';
import axiosInstance from '@/services/api';
import { Credential } from '@/services/auth/type';
import { getTokenExpiration } from '@/utils/jwt';

export const AuthAPI = {
  authorize: async (credentials: Credential) => axiosInstance.post(API_ROUTES.LOGIN, credentials),
  refreshToken: async (token: JWT) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${API_ROUTES.REFRESH_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token.refresh_token,
          }),
        }
      );

      const refreshedTokens = await response.json();

      if (!response.ok) {
        throw refreshedTokens;
      }

      // Extract expiration times from the new tokens
      const accessTokenExpiration = getTokenExpiration(refreshedTokens.access_token);
      const refreshTokenExpiration = getTokenExpiration(refreshedTokens.refresh_token);

      return {
        ...token,
        access_token: refreshedTokens.access_token,
        refresh_token: refreshedTokens.refresh_token,
        access_token_expires_at: accessTokenExpiration,
        refresh_token_expires_at: refreshTokenExpiration,
        user: refreshedTokens.user || token.user,
      };
    } catch {
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }
  },
};
