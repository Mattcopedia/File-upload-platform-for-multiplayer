import * as React from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// eslint-disable-next-line import/named
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';

import { useDateSelector } from '@/hooks/useDateSelector';

import { currentDateStyle, getDayStyles } from './styles';

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isStart' && prop !== 'isEnd' && prop !== 'isInRange',
})<CustomPickerDayProps>(({ theme, isStart, isEnd, isInRange }) =>
  getDayStyles(theme, isStart, isEnd, isInRange)
) as React.ComponentType<CustomPickerDayProps>;

function Day(
  props: PickersDayProps<Dayjs> & {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    onDayClick: (day: Dayjs) => void;
  }
) {
  const { day, startDate, endDate, onDayClick, ...other } = props;

  const isStart = startDate ? day.isSame(startDate, 'day') : false;
  const isEnd = endDate ? day.isSame(endDate, 'day') : false;
  const isInRange = startDate && endDate ? day.isBetween(startDate, endDate, 'day', '[]') : false;

  return (
    <CustomPickersDay
      {...other}
      day={day}
      onClick={() => onDayClick(day)}
      isStart={isStart}
      isEnd={isEnd}
      isInRange={isInRange}
    />
  );
}

export default function CustomDatePicker() {
  const { range, setRange, setFilter } = useDateSelector();
  const [tempRange, setTempRange] = React.useState<{
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  }>({
    startDate: range.from ? dayjs(range.from) : null,
    endDate: range.to ? dayjs(range.to) : null,
  });

  const handleDayClick = (day: Dayjs) => {
    let newRange = { startDate: null as Dayjs | null, endDate: null as Dayjs | null };

    if (!tempRange.startDate && !tempRange.endDate) {
      // First click → single date
      newRange = { startDate: day, endDate: day };
    } else if (
      tempRange.startDate &&
      tempRange.endDate &&
      tempRange.startDate.isSame(tempRange.endDate)
    ) {
      // Second click → extend to a range
      if (day.isBefore(tempRange.startDate)) {
        newRange = { startDate: day, endDate: tempRange.startDate };
      } else if (day.isAfter(tempRange.startDate)) {
        newRange = { startDate: tempRange.startDate, endDate: day };
      } else {
        // Clicked same date again → reset to new single
        newRange = { startDate: day, endDate: day };
      }
    } else {
      // Third click or resetting → start new selection
      newRange = { startDate: day, endDate: day };
    }

    setTempRange(newRange);

    if (newRange.startDate && newRange.endDate) {
      setRange({
        from: newRange.startDate.toDate(),
        to: newRange.endDate.toDate(),
      });
      setFilter(''); // clear predefined filters when custom is chosen
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <DateCalendar
          value={tempRange.startDate || dayjs()}
          onChange={() => {}}
          shouldDisableDate={(day) => day.isAfter(dayjs(), 'day')}
          slots={{
            day: (props: PickersDayProps<Dayjs>) => (
              <Day
                {...props}
                startDate={tempRange.startDate}
                endDate={tempRange.endDate}
                onDayClick={handleDayClick}
              />
            ),
          }}
          sx={currentDateStyle()}
        />
      </Box>
    </LocalizationProvider>
  );
}
