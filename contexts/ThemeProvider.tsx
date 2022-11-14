import {
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material';

import { createTheme } from '@mui/material';
import { createContext, useEffect, useMemo, useState } from 'react';
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

type ColorMode = 'dark' | 'light';

export const ColorModeContext = createContext<{
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
}>({
  colorMode: 'light',
  setColorMode: (colorMode: ColorMode) => {},
});

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // https://mui.com/material-ui/customization/dark-mode/
  const [colorMode, setColorMode] = useState<ColorMode>(
    prefersDarkMode ? 'dark' : 'light'
  );

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
