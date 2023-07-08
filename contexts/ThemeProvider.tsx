import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { components } from 'theme/components';
import { darkPalette, lightPalette } from 'theme/palette';
import { shadows } from 'theme/shadows';
import { typography } from 'theme/typography';
import { getValue, saveValue } from 'utils/persist';

/** Color mode */

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

/** Font size */

export type FontSize = '16px' | '20px' | '24px' | '28px';

type FontsizeContextValue = {
  fontSize: FontSize;
  changeFontSize: (fontSize: FontSize) => void;
};

export const FontSizeContext = createContext<FontsizeContextValue>({
  fontSize: '16px',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  changeFontSize: (fontSize: FontSize) => {},
});

const theme = {
  shadows,
  components,
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

const BLACK = '#000';
const WHITE = '#fff';

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const router = useRouter();

  const [fontSize, setFontSize] = useState<FontSize>('16px');

  const lightTheme = createTheme({
    ...theme,
    palette: {
      mode: 'light',
      ...lightPalette,
    },
    typography: {
      ...typography,
    },
  });

  const darkTheme = createTheme({
    ...theme,
    palette: {
      mode: 'dark',
      ...darkPalette,
    },
    typography: {
      ...typography,
    },
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersColorMode = prefersDarkMode ? ColorMode.Dark : ColorMode.Light;

  const [colorMode, setColorMode] = useState<ColorMode | null>(null);

  useEffect(() => {
    const savedColorMode = getValue('colorMode');
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

  useEffect(() => {
    const savedFontSize = getValue('fontSize') as FontSize | null;
    if (savedFontSize) {
      setFontSize(savedFontSize);
      const root = document.documentElement;
      root.style.setProperty('--font-size', savedFontSize);
    }
  }, []);

  const getCurrentTheme = () => {
    // Dark mode only path.
    if (router.pathname === '/arrows') {
      return darkTheme;
    }

    if (colorMode) {
      switch (colorMode) {
        case ColorMode.Dark:
          return darkTheme;

        case ColorMode.Light:
          return lightTheme;
      }
    }

    switch (prefersColorMode) {
      case ColorMode.Dark:
        return darkTheme;

      case ColorMode.Light:
        return lightTheme;
    }
  };

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

  const changeFontSize = (fontSize: FontSize) => {
    setFontSize(fontSize);
    saveValue('fontSize', fontSize);
    const root = document.documentElement;
    root.style.setProperty('--font-size', fontSize);
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      <FontSizeContext.Provider value={{ fontSize, changeFontSize }}>
        <MuiThemeProvider theme={getCurrentTheme()}>
          {children}
        </MuiThemeProvider>
      </FontSizeContext.Provider>
    </ColorModeContext.Provider>
  );
};

export default ThemeProvider;
