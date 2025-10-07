export const TAN_QUERY_STALE_TIME = 60 * 1000;

export const BASE_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
export const MAX_MEDIA: number = 30;
export const SINGLE_UPLOAD_THRESHOLD = 100 * 1024 * 1024;
export const API_ROUTES = {
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh-token',
  CREDENTIAL_LOGIN: '/api/auth/callback/credentials',
};

export const APP_ROUTES = {
  UPLOAD_FILE: '/',
  AUTH_LOGIN: '/auth/login',
  FILES: '/files',
};

export const publicPaths = [APP_ROUTES.AUTH_LOGIN];

export enum AllowedMimeTypesEnum {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  PDF = 'application/pdf',
  TEXT = 'text/plain',
  CSV = 'text/csv',
}

export enum RolesEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export function isAllowedFileType(type: string): boolean {
  return Object.values(AllowedMimeTypesEnum).includes(type as AllowedMimeTypesEnum);
}

export const Allowed_Mime_Types: AllowedMimeTypesEnum[] = [
  AllowedMimeTypesEnum.JPEG,
  AllowedMimeTypesEnum.PDF,
  AllowedMimeTypesEnum.CSV,
  AllowedMimeTypesEnum.PNG,
  AllowedMimeTypesEnum.TEXT,
];

export const mimeToExtensions: Record<AllowedMimeTypesEnum, string[]> = {
  [AllowedMimeTypesEnum.JPEG]: ['jpeg', 'jpg'],
  [AllowedMimeTypesEnum.PNG]: ['png'],
  [AllowedMimeTypesEnum.PDF]: ['pdf'],
  [AllowedMimeTypesEnum.TEXT]: ['txt'],
  [AllowedMimeTypesEnum.CSV]: ['csv'],
};

export const ALL_TIME_FILTER = 'All Time';
export const LAST_7_DAYS = 'Last 7 Days';
export const LAST_14_DAYS = 'Last 14 Days';
export const LAST_30_DAYS = 'Last 30 Days';
export const LAST_60_DAYS = 'Last 60 Days';
export const LAST_90_DAYS = 'Last 90 Days';

export const DATE_RANGES = [
  ALL_TIME_FILTER,
  LAST_7_DAYS,
  LAST_14_DAYS,
  LAST_30_DAYS,
  LAST_60_DAYS,
  LAST_90_DAYS,
] as const;
