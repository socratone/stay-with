import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
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
  colorMode: ColorMode;
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

  const [colorMode, setColorMode] = useState<ColorMode>(ColorMode.Light);

  useEffect(() => {
    const savedColorMode = getValue<ColorMode>('colorMode');
    if (savedColorMode) {
      setColorMode(savedColorMode);
    }
  }, []);

  const currentTheme = colorMode === 'light' ? lightTheme : darkTheme;

  const toggleColorMode = () => {
    setColorMode((prevMode) => {
      const newMode =
        prevMode === ColorMode.Light ? ColorMode.Dark : ColorMode.Light;
      saveValue('colorMode', newMode);
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
