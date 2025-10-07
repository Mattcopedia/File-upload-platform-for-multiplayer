import axios from 'axios';

import api from '@/services/api';
import {
  abortMultipartType,
  abortSingleType,
  completeMultipartType,
  completeSingleUploadType,
  initiateMultipartType,
  multipartPartRequestType,
  presignedUploadType,
  putFileToS3Type,
} from '@/services/upload/type';

const UploadsApi = {
  getPresignedUrl: async (payload: presignedUploadType): Promise<{ url: string; key: string }> => {
    const response = await api.post<{ url: string; key: string }>('/upload/presigned', payload);
    return response.data;
  },

  getMultipartPresignedUrls: async (
    payload: multipartPartRequestType
  ): Promise<{ urls: { partNumber: number; url: string }[] }> => {
    const response = await api.post<{ urls: { partNumber: number; url: string }[] }>(
      '/upload/presigned-part',
      payload
    );
    return response.data;
  },

  initiateMultipartUpload: async (
    payload: initiateMultipartType
  ): Promise<{ uploadId: string; key: string }> => {
    const response = await api.post<{ uploadId: string; key: string }>(
      '/upload/initiate-multipart',
      payload
    );
    return response.data;
  },

  completeSingleUpload: async (payload: completeSingleUploadType): Promise<void> => {
    const response = await api.post<void>('/upload/complete-single', payload);
    return response.data;
  },

  completeMultipartUpload: async (payload: completeMultipartType): Promise<void> => {
    const response = await api.post<void>('/upload/complete-multipart', payload);
    return response.data;
  },

  abortMultipartUpload: async (payload: abortMultipartType): Promise<void> => {
    const response = await api.post<void>('/upload/abort-multipart', payload);
    return response.data;
  },
  abortSingleUpload: async (payload: abortSingleType): Promise<void> => {
    const response = await api.post<void>('/upload/abort-single', payload);
    return response.data;
  },

  putFileToS3: async ({
    url,
    file,
    onProgress,
    signal, // 👈 add
  }: putFileToS3Type & { onProgress?: (percent: number) => void; signal?: AbortSignal }) => {
    await axios.put(url, file, {
      headers: { 'Content-Type': file.type },
      signal,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
  },
};

export default UploadsApi;
