import { ReactNode } from 'react';

import AuthLayoutComponent from '@/components/layouts/auth';

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AuthLayoutComponent>{children}</AuthLayoutComponent>;
}
