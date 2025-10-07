'use client';

import { Box } from '@mui/material';

import Logo from '@/assets/icons/logo.svg';
import UploadLogo from '@/assets/icons/upload-platform.svg';
export default function AuthLayoutComponent({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Box mx={4}>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
          <Box mt={4}>
            <Logo />
          </Box>
          <Box mt={2}>
            <UploadLogo />
          </Box>
        </Box>
        <div>{children}</div>
      </Box>
    </main>
  );
}
