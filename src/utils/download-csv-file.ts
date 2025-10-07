// utils/download-csv-file.ts
import dayjs from 'dayjs';

import { ALL_TIME_FILTER } from '@/constants';

/** Represents a start/end date range (Unix timestamps). */
interface DateRange {
  startDate?: number;
  endDate?: number;
}

/** Props for the downloadExportCSV utility */
interface DownloadExportCsvProps {
  csvBlob: Blob;
  startAndEndDate: DateRange;
  facilityId?: string;
  filter: string;
}

/**
 * Creates a downloadable CSV file and triggers the browser download.
 * The file name is built using the facility, date range or "all time", and a suffix.
 */
export const downloadExportCSV = ({
  csvBlob,
  startAndEndDate,
  facilityId,
  filter,
}: DownloadExportCsvProps): void => {
  const url = window.URL.createObjectURL(csvBlob);
  const link = document.createElement('a');
  link.href = url;

  const formatDate = (timestamp: number) => dayjs.unix(timestamp).format('YYYY-MM-DD');

  let dateLabel = '';

  // Determine date label if range is provided
  if (startAndEndDate.startDate && startAndEndDate.endDate) {
    const start = formatDate(startAndEndDate.startDate);
    const end = formatDate(startAndEndDate.endDate);

    dateLabel = start === end ? `date-${start}` : `from-${start}_to-${end}`;
  }

  const parts = [
    `facility-${facilityId}`,
    filter === ALL_TIME_FILTER ? 'all' : dateLabel,
    'files',
  ].filter(Boolean);

  link.setAttribute('download', `${parts.join('_')}.csv`);

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};
