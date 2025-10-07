import api from '@/services/api';
import { FilesResponse } from '@/services/files/type';

export const FilesApi = {
  getFiles: async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      startDate?: string;
      endDate?: string;
      allTime?: string;
    },
    id: string
  ): Promise<FilesResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.allTime) {
      queryParams.append('allTime', 'true');
    } else {
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
    }

    const response = await api.get(`/files/facility/${id}?${queryParams}`);

    return response.data;
  },
  exportFiles: async (
    params: {
      startDate?: string;
      endDate?: string;
      allTime?: string;
    },
    id: string
  ): Promise<Blob> => {
    const queryParams = new URLSearchParams();

    if (params?.allTime) {
      queryParams.append('allTime', 'true');
    } else {
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
    }

    const response = await api.get(`/files/facility/${id}/export?${queryParams}`, {
      responseType: 'blob',
    });

    return response.data as Blob;
  },
  deleteFiles: async (facilityId: string, files: string[]) => {
    const response = await api.patch(`/files/facility/${facilityId}/bulk-delete`, {
      files,
    });
    return response.data as { moved: string[]; notFound: string[] };
  },
};
