import '@/app/globals.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import theme from '@/assets/styles/theme';
import { UploadFilesProvider } from '@/context/UploadFilesContext';
import SessionProvider from '@/providers/SessionProvier';
import TanstackProvider from '@/providers/TanstackProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Helium Hospital File Upload Portal',
  description:
    'A secure web application for uploading and managing hospital records with real-time progress tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TanstackProvider>
          <SessionProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <UploadFilesProvider>{children}</UploadFilesProvider>

              <Toaster />
            </ThemeProvider>
          </SessionProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
