'use client';
import { ReactNode, useState } from 'react';

import { Box, Divider } from '@mui/material';
import type { Metadata } from 'next';

import UploadLogo from '@/assets/icons/upload-platform.svg';
import styles from '@/components/layouts/default/default-styles.module.css';
import SideBar from '@/components/modules/navigation/sidebar';

export const metadata: Metadata = {
  title: 'Helium Health File Upload Platform',
  description:
    'A secure and reliable platform for uploading and managing health-related files at Helium Health.',
};

export default function DefaultLayoutComponent({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <main className={styles.default}>
      <SideBar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'flex-end'} mt={1} mr={2}>
          <UploadLogo />
        </Box>
        <Divider className={styles.content__divider} />
        <div className={`${styles.content} ${sidebarCollapsed ? styles.content__collapsed : ''}`}>
          {children}
        </div>
      </div>
    </main>
  );
}
