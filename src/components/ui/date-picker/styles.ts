import { Theme } from '@mui/material';

export const btn1 = (theme: Theme) => {
  return {
    minWidth: '92px',
    maxHeight: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[100],
    textTransform: 'capitalize',
    borderRadius: '8px',
    py: '10px',
    px: '12px',
  };
};

export const popover = {
  '& .MuiPaper-root': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: '12px',
    overflow: 'visible',
    filter: 'drop-shadow( 0px 10px 40px 0px #0000001F)',
    height: '300px',
    minHeight: 'max-content',
  },
};

export const paperStyle = {
  overflow: 'hidden',
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  flexShrink: 0,
  gap: 3,
  margingBottom: '20px !important',
  minHeight: '330px !important',
};

export const currentDateStyle = () => {
  return {
    '.MuiPickersDay-today': {
      color: '#fff',
      borderRadius: '99px !important',
      backgroundColor: '#5760db',
    },
  };
};

export const getDayStyles = (
  theme: Theme,
  isStart: boolean,
  isEnd: boolean,
  isInRange: boolean
) => ({
  '&.MuiPickersDay-today': {
    color: '#fff',
    borderRadius: '8px',
    backgroundColor: theme.palette.secondary.main,
  },
  ...(isInRange && {
    borderRadius: '1px',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    marginLeft: '-1px',
    marginRight: '-1px',
  }),
  ...(isStart && {
    borderRadius: '8px !important',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    marginRight: '-10px',
  }),
  ...(isEnd && {
    borderRadius: '8px !important',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    marginLeft: '-10px',
    '&:active, &:hover, &:focus': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.contrastText,
    },
  }),
});
