import { useContext } from 'react';
import { ColorModeContext } from '../../contexts/ThemeProvider';

const useColorMode = () => {
  return useContext(ColorModeContext);
};

export default useColorMode;
