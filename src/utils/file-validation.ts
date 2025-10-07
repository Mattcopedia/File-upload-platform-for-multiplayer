import { AllowedMimeTypesEnum, mimeToExtensions } from '@/constants';

const allowedExtensions = Object.values(mimeToExtensions).flat();
const extensionPattern = allowedExtensions.join('|');

export const validNamePattern = new RegExp(
  `^([A-Za-z0-9()]+)_([A-Za-z0-9()]+)_([A-Za-z0-9()]+)_(\\d{8})\\.(${extensionPattern})$`,
  'i'
);

export function isValidFileName(fullName: string): boolean {
  const match = fullName.match(validNamePattern);
  if (!match) return false;

  const dateStr = match[4]; // YYYYMMDD
  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(4, 6), 10) - 1;
  const day = parseInt(dateStr.slice(6, 8), 10);

  const date = new Date(year, month, day);
  const isValidDate =
    date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;

  const ext = match[5].toLowerCase();
  const isValidExt = allowedExtensions.includes(ext);

  return isValidDate && isValidExt;
}

export const buildAcceptString = (allowed: AllowedMimeTypesEnum[]): string => {
  return allowed.flatMap((mime) => mimeToExtensions[mime].map((ext) => `.${ext}`)).join(',');
};

export function isValidBaseFileName(name: string): boolean {
  const baseFileNamePattern = /^[A-Za-z0-9()]+$/;
  return baseFileNamePattern.test(name);
}

export function getBaseFileName(fullName: string): string {
  const lastDotIndex = fullName.lastIndexOf('.');
  if (lastDotIndex === -1) return fullName;
  return fullName.slice(0, lastDotIndex);
}

export function validateNamingConventionParts(
  baseName?: string,
  uniqueFileId?: string,
  facilityName?: string,
  todayDate?: string,
  extension?: string
): string | null {
  if (!baseName || !uniqueFileId || !facilityName || !todayDate || !extension) {
    return 'All parts of the file naming convention are required. Please refresh the page and try again.';
  }
  return null;
}
