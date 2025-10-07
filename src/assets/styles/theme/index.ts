'use client';
import { createTheme } from '@mui/material/styles';

import { COLORS } from '@/assets/styles/theme/colors';

const theme = createTheme({
  cssVariables: true,
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: 'var(--font-roboto-flex)',
    h4: {
      fontSize: 'var(--font-heading-4)',
      fontWeight: 800,
    },
    subtitle1: {
      fontSize: 'var(--font-subtitle-1)',
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
      fontSize: 'var(--font-body-2)',
    },
    overline: {
      fontWeight: 600,
      fontSize: 'var(--spacing-xs)',
    },
  },

  palette: {
    text: {
      primary: 'var(--color-secondary)',
      secondary: 'var(--color-grey300)',
    },
    primary: {
      main: 'var(--color-primary)',
      light: 'var( --color-blue200)',
      dark: 'var(--color-primary900)',
      contrastText: 'var(--color-white)',
    },
    secondary: {
      main: COLORS.secondary, // FIXME101: This is a temporary solution for MUI CSS variable support
      contrastText: 'var(--color-white)',
    },
    error: {
      main: COLORS.error,
    },
    success: {
      main: COLORS.success,
    },
    grey: {
      100: 'var(--color-grey100)',
      400: 'var(--color-grey400)',
      900: 'var(--color-black)',
    },
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 'var(--font-body-1)',
          color: 'var(--color-grey400)',
          border: 'none',
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: 'var(--color-primary100)',
            color: 'var(--color-primary)',
          },
          '&:hover': {
            backgroundColor: 'var(--color-grey100)',
          },
          '&.MuiToggleButtonGroup-grouped': {
            margin: 0,
            border: 'none',
            borderRadius: 'var(--border-radius-xs)',
          },
        },
      },
    },

    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 'var(--spacing-xs)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 'var(--spacing-xxs)',
          backgroundColor: 'var(--color-grey100)',
          borderRadius: 'var(--border-radius-xxs)',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: 'var(--spacing-md)',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid var(--color-grey50)',
        },
        head: {
          color: 'var(--color-grey600)',
          paddingTop: 8,
          paddingBottom: 8,
          fontWeight: 500,
          background: 'var(--color-white)',
        },
        body: {
          fontWeight: 500,
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        root: {
          '.MuiStepConnector-line': {
            borderColor: 'var(--color-grey290)',
          },
          '&.Mui-completed .MuiStepConnector-line': {
            borderColor: 'var(--color-primary)',
          },
          '&.Mui-active .MuiStepConnector-line': {
            borderColor: 'var(--color-primary)',
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          width: 'var(--spacing-4xl)',
          height: 'var(--spacing-4xl)',
          color: 'var(--color-grey290)',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontWeight: 600,
          color: 'var(--color-grey290)',
          '&.Mui-active': {
            color: 'var(--color-primary)',
            fontWeight: 600,
          },
          '&.Mui-completed': {
            color: 'var(--color-primary)',
            fontWeight: 600,
          },
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 0,
          '& .CustomRadioIcon': {
            borderRadius: 'var(--border-radius-max)',
            width: 'var(--spacing-md)',
            height: 'var(--spacing-md)',
            boxShadow: 'var(--shadow-elevation-radio)',
            backgroundColor: 'var(--color-grey50)',
            'input:disabled ~ &': {
              boxShadow: 'none',
              background: 'var(--color-grey290)',
            },
          },
          '& .CustomRadioCheckedIcon': {
            backgroundColor: 'var(--color-primary)',
            '&::before': {
              display: 'block',
              width: 'var(--spacing-md)',
              height: 'var(--spacing-md)',
              backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
              content: '""',
            },
            'input:hover ~ &': {
              backgroundColor: 'var(--color-primary)',
            },
          },
        },
      },
    },

    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
      styleOverrides: {
        root: {
          color: 'var(--color-blue200)',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'var(--color-grey200)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          padding: 'var(--spacing-xxl)',
          width: '90%',
          backgroundColor: 'var(--color-white)',
          boxShadow: 'var(--shadow-elevation-small)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          color: 'var(--color-secondary)',
          paddingBottom: 'var(--spacing-sm)',
        },
      },
    },

    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--backdrop-black-003)',
          backdropFilter: 'blur(3px)',
        },
      },
    },

    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableRipple: true,
        size: 'large',
      },
      styleOverrides: {
        sizeLarge: {
          padding: 'var(--spacing-sm) var(--spacing-xxl)',
        },
        sizeMedium: {
          padding: 'var(--spacing-sm) var(--spacing-lg)',
          minHeight: 36,
          fontSize: '0.875rem',
        },
        contained: {
          backgroundColor: 'var( --color-blue200)',
          color: 'var( --color-white)',
          '&:hover': {
            backgroundColor: 'var(--color-secondary)',
          },
        },
        containedSecondary: {
          backgroundColor: 'var(--color-grey100)',
          color: 'var(--color-secondary)',
          '&:hover': {
            backgroundColor: 'var(--color-grey200)',
          },
        },
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
      variants: [
        {
          props: { variant: 'delete' },
          style: {
            backgroundColor: 'var(  --color-error)',
            color: 'var( --color-white)',
            '&:hover': {
              backgroundColor: 'var( --color-primary800)',
            },
          },
        },
      ],
    },

    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-previousNext': {
            backgroundColor: 'var(--color-grey100)',
            borderRadius: 'var(--border-radius-xs)',
            '&:hover': {
              backgroundColor: 'var(--color-grey100)',
            },
          },
          '& .MuiPaginationItem-page': {
            color: 'var(--color-grey250)',
            borderRadius: 'var(--border-radius-xs)',
            fontWeight: '500',
            '&.Mui-selected': {
              backgroundColor: 'var(--color-blue200)',
              color: 'var(--color-white)',
              '&:hover': {
                backgroundColor: 'var(--color-blue200)',
              },
            },
          },
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        list: {
          padding: 0,
        },
        paper: {
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--color-grey200)',
          boxShadow: 'var(--shadow-elevation-xs)',
          maxHeight: 'var(--menu-size)',
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 'var(--spacing-5xl)',
          height: 'var(--spacing-xl)',
          padding: 'var(--spacing-none)',
        },
        switchBase: {
          padding: 'var(--spacing-none)',
          margin: 'var(--spacing-2)',
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(var(--spacing-md))',
            color: 'var(--color-white)',
            '& + .MuiSwitch-track': {
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: 'var(--color-grey300)',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            // add fallback color
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
          },
        },
        thumb: {
          boxSizing: 'border-box',
          width: 'var(--spacing-md)',
          height: 'var(--spacing-md)',
        },
        track: {
          borderRadius: 'var(--border-radius-sm)',
          backgroundColor: 'var(--color-grey400)',
          opacity: 1,
          transition: 'background-color 500ms',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'standard',
        fullWidth: true,
        size: 'medium',

        slotProps: {
          inputLabel: {
            shrink: true,
          },
        },
      },
    },

    // The style below is applied to the MUISelect component
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 'var(--spacing-8xl)',
          borderRadius: 'var(--spacing-sm)',
          backgroundColor: 'var(--color-grey100)',
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-grey100)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-grey100)',
          },
          '&.MuiInputBase-root': {
            marginTop: 'var(--spacing-xs)',
          },
        },
        notchedOutline: {
          border: 'none',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--color-secondary)',
          fontSize: 'var(--font-body-1)',
          fontWeight: 500,
          transform: 'none',
          position: 'static',
          transition: 'none',
          '&.Mui-focused': {
            color: 'var(--color-secondary)',
          },
        },
        shrink: {
          transform: 'none',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: ({ ownerState }) => {
          return ownerState['data-variant'] === 'search'
            ? {
                padding:
                  'var(--spacing-xxs) var(--spacing-sm) var(--spacing-xxs) var(--spacing-sm)',
                borderRadius: 'var(--border-radius-xs)',
                minWidth: '300px',
                position: 'relative',
                border: '1px solid var(--color-grey200)',
                '&:before': {
                  borderBottom: 'none',
                },
                '&:after': {
                  borderBottom: 'none',
                },
                '&:hover:not(.Mui-disabled):before': {
                  borderBottom: 'none',
                },
                'input[type="search"]::-webkit-search-cancel-button': {
                  height: '15px',
                  width: '15px',
                  backgroundSize: 'contain',
                  cursor: 'pointer',
                  position: 'absolute',
                  right: '10px',
                },
              }
            : {
                backgroundColor: 'var(--color-grey100)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderBottom: 'none',
                borderRadius: 'var(--border-radius-xs)',
                '&:before': {
                  borderBottom: 'none',
                },
                '&:after': {
                  borderBottom: 'none',
                },
                '&:hover:not(.Mui-disabled):before': {
                  borderBottom: 'none',
                },
              };
        },
        input: {
          color: 'var(--color-secondary)',
          '&::placeholder': {
            color: 'var(--color-grey300)',
            opacity: 1,
          },
        },
      },
    },
  },
});

export default theme;
