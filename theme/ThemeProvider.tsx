import {
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material';

import { createTheme } from '@mui/material';
import { useMemo } from 'react';
import { PRIMARY_BOX_SHADOW } from './boxShadow';

// https://stackoverflow.com/questions/60424596/cant-customize-color-palette-types-on-material-ui-theme-in-typescript
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    paper?: Palette['primary'];
  }
  interface PaletteOptions {
    paper?: PaletteOptions['primary'];
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // https://mui.com/material-ui/customization/dark-mode/
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          paper: {
            main: prefersDarkMode ? 'rgb(55, 40, 14)' : '#fff',
          },
        },
        typography: {
          fontFamily: [
            'Pretendard',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        },
        shadows: [
          'none',
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
          PRIMARY_BOX_SHADOW,
        ],
        components: {
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
          },
          MuiTypography: {
            defaultProps: {
              color: 'black',
            },
          },
        },
      }),
    [prefersDarkMode]
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
