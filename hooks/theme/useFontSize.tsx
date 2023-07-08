import { FontSizeContext } from 'contexts/ThemeProvider';
import { useContext } from 'react';

const useFontSize = () => {
  const context = useContext(FontSizeContext);
  return { ...context, fontSizeNumber: Number(context.fontSize.slice(0, -2)) };
};

export default useFontSize;
