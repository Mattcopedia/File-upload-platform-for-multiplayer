import { ReactNode } from 'react';

import DefaultLayoutComponent from '@/components/layouts/default';

export default function DefaultLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <DefaultLayoutComponent>{children}</DefaultLayoutComponent>;
}
