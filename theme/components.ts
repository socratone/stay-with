import { ThemeOptions } from '@mui/material';

export const components: ThemeOptions['components'] = {
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      contained: {
        borderRadius: 8,
      },
      text: {
        borderRadius: 8,
      },
    },
  },
  MuiMenu: {
    defaultProps: {
      sx: {
        '.MuiPaper-root': {
          borderRadius: 4,
          mt: 1,
        },
      },
    },
  },
};
