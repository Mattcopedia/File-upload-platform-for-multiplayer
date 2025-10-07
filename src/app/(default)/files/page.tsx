'use client';
import FilePageComponent from '@/components/pages/Files';
import { CustomDateProvider } from '@/hooks/useDateSelector';

export default function Home() {
  return (
    <CustomDateProvider>
      <FilePageComponent />
    </CustomDateProvider>
  );
}
