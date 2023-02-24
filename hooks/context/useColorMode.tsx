import { useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from 'redux/colorSlice';
import { RootState } from 'redux/store';

const useColorMode = () => {
  const dispatch = useDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersColorMode = prefersDarkMode ? 'dark' : 'light';
  const colorMode = useSelector((state: RootState) => state.color.mode);

  const setColorMode = (colorMode: 'dark' | 'light') => {
    dispatch(setMode(colorMode));
  };

  return {
    colorMode: colorMode === 'none' ? prefersColorMode : colorMode,
    setColorMode,
  };
};

export default useColorMode;
