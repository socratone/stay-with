import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { components } from 'theme/components';
import { darkPalette } from 'theme/palette';
import { shadows } from 'theme/shadows';
import { typography } from 'theme/typography';

const theme = {
  typography,
  shadows,
  components,
};

type DarkThemeProviderProps = {
  children: React.ReactNode;
};

const DarkThemeProvider: React.FC<DarkThemeProviderProps> = ({ children }) => {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      ...darkPalette,
    },
    ...theme,
  });

  return <MuiThemeProvider theme={darkTheme}>{children}</MuiThemeProvider>;
};

export default DarkThemeProvider;
