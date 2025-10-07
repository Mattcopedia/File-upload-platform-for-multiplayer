import { MouseEvent, useState } from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, Pagination as MuiPagination, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import MuiDivider from '@mui/material/Divider';
import MuiMenu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { PaginationProps } from '@mui/material/Pagination';
import MuiTypography from '@mui/material/Typography';

import styles from '@/components/ui/pagination/pagination-styles.module.css';
export const Pagination = ({
  rowsPerPage,
  onPageChange,
  ...props
}: { rowsPerPage: number; onPageChange: (value: number) => void } & PaginationProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const togglePageDropdown = (event: MouseEvent<HTMLElement> | null) => {
    setAnchorEl(event ? event.currentTarget : null);
  };

  const handleClose = () => togglePageDropdown(null);

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>) => {
    togglePageDropdown(null);
    onPageChange(Number(event.currentTarget.getAttribute('data-value')));
  };

  return (
    <div className={styles.pagination}>
      <Box>
        <Button onClick={togglePageDropdown} variant='text'>
          <Typography
            className={styles.pagination__dropdown}
            color='text.secondary'
            component='span'
            variant='body2'
          >
            {rowsPerPage}
            <ArrowDropDownIcon />

            <MuiTypography color='secondary' component='span' variant='body2' pr={1}>
              Rows per page
            </MuiTypography>
          </Typography>
        </Button>
        <MuiMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {[5, 10, 25].map((option) => (
            <MuiMenuItem
              key={option}
              selected={option === rowsPerPage}
              data-value={option}
              onClick={handleMenuItemClick}
            >
              {option}
            </MuiMenuItem>
          ))}
        </MuiMenu>
      </Box>

      <MuiDivider orientation='vertical' className={styles.pagination__divider} />
      <MuiPagination shape='rounded' {...props} />
    </div>
  );
};
