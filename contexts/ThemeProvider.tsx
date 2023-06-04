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

// https://stackoverflow.com/questions/60424596/cant-customize-color-palette-types-on-material-ui-theme-in-typescript
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    paper?: Palette['primary'];
    kakao: SimplePaletteColorOptions;
  }
  interface PaletteOptions {
    paper?: PaletteOptions['primary'];
    kakao: SimplePaletteColorOptions;
  }
}

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

type FontsizeContextValue = {
  fontSize: number;
  changeFontSize: (fontSize: number) => void;
};

export const FontSizeContext = createContext<FontsizeContextValue>({
  fontSize: 16,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  changeFontSize: (fontSize: number) => {},
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

  const [fontSize, setFontSize] = useState(16);

  const lightTheme = createTheme({
    ...theme,
    palette: {
      mode: 'light',
      ...lightPalette,
    },
    typography: {
      ...typography,
      fontSize,
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
      fontSize,
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

  const getCurrentTheme = () => {
    // Dark mode only path.
    if (router.asPath === '/arrows') {
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

  const changeFontSize = (fontSize: number) => {
    setFontSize(fontSize);
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
