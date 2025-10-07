'use client';
import { createContext, ReactNode, useContext } from 'react';

import { useUploadFiles } from '@/hooks/useUploadingFiles';

const UploadFilesContext = createContext<ReturnType<typeof useUploadFiles> | null>(null);

export const UploadFilesProvider = ({ children }: { children: ReactNode }) => {
  const uploadFiles = useUploadFiles();
  return <UploadFilesContext.Provider value={uploadFiles}>{children}</UploadFilesContext.Provider>;
};

export const useUploadFilesContext = () => {
  const context = useContext(UploadFilesContext);
  if (!context) {
    throw new Error('useUploadFilesContext must be used inside <UploadFilesProvider>');
  }
  return context;
};
