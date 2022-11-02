import { useContext } from 'react';
import { ColorModeContext } from '../../theme/ThemeProvider';

const useColorMode = () => {
  return useContext(ColorModeContext);
};

export default useColorMode;
