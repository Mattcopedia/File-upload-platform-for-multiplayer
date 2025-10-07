import { AxiosError } from 'axios';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AuthAPI } from '@/services/auth';
import { getTokenExpiration, isTokenExpired } from '@/utils/jwt';
const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await AuthAPI.authorize({
            email: credentials.email,
            password: credentials.password,
          });
          const data = await res?.data;
          if (data) {
            return {
              ...data.user,
              access_token: data.access_token,
              refresh_token: data.refresh_token,
            };
          }

          return null;
        } catch (error) {
          const axiosError = error as AxiosError<{ message?: string }>;
          const errorMessage = axiosError.response?.data?.message || 'Invalid credentials';
          throw new Error(errorMessage);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in with Credentials
      if (user) {
        // Extract expiration times from tokens
        const accessTokenExpiration = getTokenExpiration(user.access_token);
        const refreshTokenExpiration = getTokenExpiration(user.refresh_token);

        return {
          ...token,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          access_token_expires_at: accessTokenExpiration,
          refresh_token_expires_at: refreshTokenExpiration,
          user: {
            id: user.id,
            uniqueId: user.uniqueId,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            facility: {
              id: user.facility.id,
              name: user.facility.name,
              location: user.facility.location,
            },

            isActive: user.isActive,
          },
        };
      }

      // Check if we have tokens and they're not expired
      if (!token.access_token || !token.refresh_token) {
        return { ...token, error: 'NoTokensAvailable' };
      }

      // Check if refresh token is expired
      if (token.refresh_token && isTokenExpired(token.refresh_token as string, 0)) {
        return { ...token, error: 'RefreshTokenExpired' };
      }

      // Check if access token needs refresh (with 60 second buffer)
      if (token.access_token && isTokenExpired(token.access_token as string, 60)) {
        return AuthAPI.refreshToken(token);
      }

      // Token is still valid
      return token;
    },

    async session({ session, token }) {
      // Pass error state to session so API service can handle it
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      session.error = token.error;

      return {
        ...session,
        user: token.user || session.user,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        error: token.error,
      };
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
