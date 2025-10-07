import React, { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  ClickAwayListener,
  FormControl,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  Typography,
  Box,
} from '@mui/material';

import {
  ALL_TIME_FILTER,
  LAST_14_DAYS,
  LAST_30_DAYS,
  LAST_60_DAYS,
  LAST_7_DAYS,
  LAST_90_DAYS,
} from '@/constants';
import { useDateSelector } from '@/hooks/useDateSelector';
import CustomDatePicker from '@/components/ui/date-picker';
import styles from '@/components/ui/date-picker/index.module.css';

import { paperStyle, popover } from './styles';

const DateFilters = () => {
  const { filter, setFilter, startAndEndDate, resetRange } = useDateSelector();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterChange = (value: string) => {
    resetRange();
    setFilter(value);
  };

  const handleSelectClick = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
    setIsDropdownOpen(true);
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
    setAnchorEl(null);
  };

  return (
    <Box>
      <FormControl sx={{ minWidth: 91 }}>
        <Box onClick={handleSelectClick} className={styles.list__select}>
          <Typography fontWeight={600} px={2}>
            {filter !== '' ? filter : startAndEndDate.formattedDate}
          </Typography>
          <ExpandMoreIcon className={styles.list__icon2} />
        </Box>
      </FormControl>

      {/* Popover to contain both the Select dropdown and DatePicker */}
      <Popover
        open={isDropdownOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={popover}
        slotProps={{
          backdrop: {
            invisible: true,
            sx: { backgroundColor: 'transparent' },
          },
        }}
        hideBackdrop
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Box display={'flex'} flexDirection={'row'}>
            {/* Select Dropdown */}
            <Paper elevation={0} sx={paperStyle}>
              <List>
                {[
                  LAST_7_DAYS,
                  LAST_14_DAYS,
                  LAST_30_DAYS,
                  LAST_60_DAYS,
                  LAST_90_DAYS,
                  ALL_TIME_FILTER,
                ].map((option) => (
                  <ListItemButton
                    sx={{ gap: 1, mb: 0.9 }}
                    key={option}
                    selected={filter === option}
                    onClick={() => handleFilterChange(option)}
                  >
                    <ListItemText primary={option} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>

            {/* DatePicker */}
            <Paper
              sx={{
                overflow: 'hidden',
                minWidth: 'max-content',
              }}
            >
              <CustomDatePicker />
            </Paper>
          </Box>
        </ClickAwayListener>
      </Popover>
    </Box>
  );
};

export default DateFilters;
