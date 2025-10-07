import { DefaultSession } from 'next-auth';

import { RolesEnum } from '@/constants';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      uniqueId: string;
      email: string;
      role: RolesEnum;
      firstName?: string;
      lastName?: string;
      facility: {
        id: string;
        name: string;
        location: string;
      };
      isActive: boolean;
    } & DefaultSession['user'];
    access_token?: string;
    refresh_token?: string;
    error?: string;
    expires: string;
  }

  interface User {
    id: string;
    uniqueId: string;
    access_token: string;
    refresh_token: string;
    email: string;
    role: RolesEnum;
    firstName?: string;
    lastName?: string;
    facility: {
      id: string;
      name: string;
      location: string;
    };
    isActive: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    access_token_expires_at?: number | null;
    refresh_token_expires_at?: number | null;
    error?: string;
    user?: {
      id: string;
      uniqueId: string;
      email: string;
      role: RolesEnum;
      firstName?: string;
      lastName?: string;
      facility: {
        id: string;
        name: string;
        location: string;
      };
      isActive: boolean;
    };
  }
}
