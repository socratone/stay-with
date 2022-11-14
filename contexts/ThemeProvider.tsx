import {
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material';

import { createTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import useColorMode from '../hooks/context/useColorMode';
import { darkPalette, lightPalette } from '../theme/palette';
import { shadows } from '../theme/shadows';
import { typography } from '../theme/typography';

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
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === 'light') {
      document.body.style.backgroundColor = '#fff';
    } else {
      document.body.style.backgroundColor = '#000';
    }
  }, [colorMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
          ...(colorMode === 'light' ? lightPalette : darkPalette),
        },
        typography,
        shadows,
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

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
