import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { ALL_TIME_FILTER } from '@/constants';
import { FilesApi } from '@/services/files';

interface DateRange {
  startDate?: number;
  endDate?: number;
}

interface UseFilesParams {
  facilityId?: string;
  page: number;
  rowsPerPage: number;
  searchQuery: string;
  startAndEndDate: DateRange;
  filter: string;
}

export const useFiles = ({
  facilityId,
  page,
  rowsPerPage,
  searchQuery,
  startAndEndDate,
  filter,
}: UseFilesParams) => {
  return useQuery({
    queryKey: [
      'files',
      page,
      rowsPerPage,
      searchQuery,
      filter,
      startAndEndDate.startDate,
      startAndEndDate.endDate,
    ],
    queryFn: () => {
      if (!facilityId) throw new Error('Missing facilityId');

      const queryParams: {
        page?: number;
        limit?: number;
        search?: string;
        startDate?: string;
        endDate?: string;
        allTime?: string;
      } = {
        page,
        limit: rowsPerPage,
        search: searchQuery || undefined,
      };

      if (filter === ALL_TIME_FILTER) {
        queryParams.allTime = 'true';
      } else if (startAndEndDate.startDate && startAndEndDate.endDate) {
        queryParams.startDate = dayjs.unix(startAndEndDate.startDate).format('YYYY-MM-DD');
        queryParams.endDate = dayjs.unix(startAndEndDate.endDate).format('YYYY-MM-DD');
      }

      return FilesApi.getFiles(queryParams, facilityId);
    },
    placeholderData: (prev) => prev,
    enabled: !!facilityId,
  });
};
