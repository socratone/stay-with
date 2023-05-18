import { ColorModeContext } from 'contexts/ThemeProvider';
import { useContext } from 'react';

const useColorMode = () => {
  return useContext(ColorModeContext);
};

export default useColorMode;
