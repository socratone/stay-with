import { FontSizeContext } from 'contexts/ThemeProvider';
import { useContext } from 'react';

const useFontSize = () => {
  return useContext(FontSizeContext);
};

export default useFontSize;
