import {
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material';

import { createTheme } from '@mui/material';
import { createContext, useMemo, useState } from 'react';
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

type ColorMode = 'dark' | 'light';

export const ColorModeContext = createContext({
  colorMode: 'light',
  setColorMode: (colorMode: ColorMode) => {},
});

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // https://mui.com/material-ui/customization/dark-mode/
  const [colorMode, setColorMode] = useState<ColorMode>(
    prefersDarkMode ? 'dark' : 'light'
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
          paper: {
            main: colorMode === 'dark' ? 'rgb(52, 51, 64)' : '#fff',
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
        },
      }),
    [colorMode]
  );

  return (
    <ColorModeContext.Provider
      value={{
        colorMode,
        setColorMode,
      }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;
