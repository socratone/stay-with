import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { createContext, useEffect, useState } from 'react';
import { components } from 'theme/components';
import { darkPalette, lightPalette } from 'theme/palette';
import { shadows } from 'theme/shadows';
import { typography } from 'theme/typography';
import { saveValue } from 'utils/persist';

// https://stackoverflow.com/questions/60424596/cant-customize-color-palette-types-on-material-ui-theme-in-typescript
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    paper?: Palette['primary'];
  }
  interface PaletteOptions {
    paper?: PaletteOptions['primary'];
  }
}

export enum ColorMode {
  Light = 'light',
  Dark = 'dark',
}

type ColorModeContextValue = {
  colorMode: ColorMode | null;
  toggleColorMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextValue>({
  colorMode: ColorMode.Light,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  toggleColorMode: () => {},
});

const theme = {
  typography,
  shadows,
  components,
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

const BLACK = '#000';
const WHITE = '#fff';

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      ...lightPalette,
    },
    ...theme,
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      ...darkPalette,
    },
    ...theme,
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersColorMode = prefersDarkMode ? ColorMode.Dark : ColorMode.Light;

  const [colorMode, setColorMode] = useState<ColorMode | null>(null);

  useEffect(() => {
    const savedColorMode = localStorage.getItem('colorMode');
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const colorMode = savedColorMode ?? prefersDarkMode;
    const backgroundColor = colorMode === ColorMode.Dark ? BLACK : WHITE;

    if (backgroundColor === '#fff') {
      setColorMode(ColorMode.Light);
    } else {
      setColorMode(ColorMode.Dark);
    }
  }, []);

  const currentTheme =
    (colorMode ?? prefersColorMode) === ColorMode.Light
      ? lightTheme
      : darkTheme;

  const toggleColorMode = () => {
    setColorMode((prevMode) => {
      const newMode =
        prevMode === ColorMode.Light ? ColorMode.Dark : ColorMode.Light;
      saveValue('colorMode', newMode);

      const backgroundColor = newMode === ColorMode.Dark ? BLACK : WHITE;
      const root = document.documentElement;
      root.style.setProperty('--background-color', backgroundColor);

      return newMode;
    });
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      <MuiThemeProvider theme={currentTheme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;
