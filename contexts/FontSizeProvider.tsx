import { createTheme, ThemeProvider } from '@mui/material';
import { createContext, useState } from 'react';
import { typography } from 'theme/typography';

type FontsizeContextValue = {
  fontSize: number;
  changeFontSize: (fontSize: number) => void;
};

export const FontSizeContext = createContext<FontsizeContextValue>({
  fontSize: 16,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  changeFontSize: (fontSize: number) => {},
});

type FontSizeProviderProps = {
  children: React.ReactNode;
};

const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);

  const theme = createTheme({
    typography: {
      ...typography,
      fontSize,
    },
  });

  const changeFontSize = (fontSize: number) => {
    setFontSize(fontSize);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, changeFontSize }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </FontSizeContext.Provider>
  );
};

export default FontSizeProvider;
