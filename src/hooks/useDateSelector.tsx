import React, { createContext, useContext, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { ALL_TIME_FILTER } from '@/constants';
import { getDateRangeInUnix } from '@/utils/getDateRangeInUnix';

interface Range {
  from: Date | undefined;
  to?: Date | undefined;
}

interface StartAndEndDate {
  startDate: number | undefined;
  endDate: number | undefined;
  formattedDate?: string;
}

const initialState: Range = {
  from: undefined,
  to: undefined,
};

interface CustomDateContextType {
  range: Range;
  setRange: (range: Range) => void;
  filter: string;
  setFilter: (filter: string) => void;
  startAndEndDate: StartAndEndDate;
  resetRange: () => void;
}

const CustomDateContext = createContext<CustomDateContextType>({
  range: initialState,
  setRange: () => {},
  filter: ALL_TIME_FILTER,
  setFilter: () => {},
  startAndEndDate: {
    startDate: undefined,
    endDate: undefined,
  },
  resetRange: () => {},
});

export default function CustomDateProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<Range>(initialState);
  const [filter, setFilter] = useState(ALL_TIME_FILTER);
  const [startAndEndDate, setStartAndEndDate] = useState<StartAndEndDate>({
    startDate: undefined,
    endDate: undefined,
    formattedDate: undefined,
  });

  const resetRange = () => setRange(initialState);

  useEffect(() => {
    const [startDate, endDate] = getDateRangeInUnix(
      range.from !== undefined || range.to !== undefined ? range : filter
    );

    let formattedDate: string | undefined;

    // ✅ Only custom ranges show formatted date in button
    if (startDate && endDate && filter === '') {
      const start = dayjs.unix(startDate).format('DD/MM/YY');
      const end = dayjs.unix(endDate).format('DD/MM/YY');
      formattedDate = start === end ? start : `${start} - ${end}`;
    }

    setStartAndEndDate({
      startDate,
      endDate,
      formattedDate,
    });
  }, [range, filter]);

  return (
    <CustomDateContext.Provider
      value={{
        range,
        setRange,
        filter,
        setFilter,
        startAndEndDate,
        resetRange,
      }}
    >
      {children}
    </CustomDateContext.Provider>
  );
}

function useDateSelector() {
  const context = useContext(CustomDateContext);
  if (context === undefined) {
    throw new Error('useDateSelector must be used within a CustomDateProvider');
  }
  return context;
}

export { CustomDateProvider, useDateSelector };
