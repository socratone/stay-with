import { FontSizeContext } from 'contexts/FontSizeProvider';
import { useContext } from 'react';

const useFontSize = () => {
  return useContext(FontSizeContext);
};

export default useFontSize;
