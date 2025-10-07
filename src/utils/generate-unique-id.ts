import { customAlphabet } from 'nanoid';
// 12-char random string → ~4.7e18 possibilities
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 12);
export function generateFileId(): string {
  return nanoid();
}

export const userData = (user?: string) => {
  if (!user) return undefined;
  if (user.includes(' ')) {
    return user.replace(/\s+/g, '');
  } else {
    return user.charAt(0).toUpperCase() + user.slice(1);
  }
};
