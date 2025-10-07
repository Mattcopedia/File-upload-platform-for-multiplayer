// utils/getDateRangeInUnix.ts
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

import {
  ALL_TIME_FILTER,
  LAST_14_DAYS,
  LAST_30_DAYS,
  LAST_60_DAYS,
  LAST_7_DAYS,
  LAST_90_DAYS,
} from '@/constants';

interface Range {
  from: Date | undefined;
  to?: Date | undefined;
}

export const getDateRangeInUnix = (range: string | Range): [number, number] => {
  const now = dayjs();

  if (typeof range === 'string') {
    switch (range) {
      case LAST_7_DAYS:
        return [now.subtract(7, 'day').startOf('day').unix(), now.endOf('day').unix()];
      case LAST_14_DAYS:
        return [now.subtract(14, 'day').startOf('day').unix(), now.endOf('day').unix()];
      case LAST_30_DAYS:
        return [now.subtract(30, 'day').startOf('day').unix(), now.endOf('day').unix()];
      case LAST_60_DAYS:
        return [now.subtract(60, 'day').startOf('day').unix(), now.endOf('day').unix()];
      case LAST_90_DAYS:
        return [now.subtract(90, 'day').startOf('day').unix(), now.endOf('day').unix()];
      case ALL_TIME_FILTER:
        // ✅ Fix: Default "All Time" means today → today
        return [now.startOf('day').unix(), now.endOf('day').unix()];
      default:
        return [now.startOf('day').unix(), now.endOf('day').unix()];
    }
  }

  // ✅ Handle custom single date / range selection
  if (typeof range === 'object') {
    if (range.from && !range.to) {
      // single date
      const single = dayjs(range.from).startOf('day');
      return [single.unix(), single.endOf('day').unix()];
    }

    if (range.from && range.to) {
      const fromDate = dayjs(range.from).startOf('day');
      const toDate = dayjs(range.to).endOf('day');
      return [fromDate.unix(), toDate.unix()];
    }

    return [now.startOf('day').unix(), now.endOf('day').unix()];
  }

  toast.error('Invalid input: Expected a date range string or object.');
  return [now.startOf('day').unix(), now.endOf('day').unix()];
};
