import { useMediaQuery } from '@mui/material';
import { setMode } from 'redux/colorSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { RootState } from 'redux/store';

const useColorMode = () => {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersColorMode = prefersDarkMode ? 'dark' : 'light';
  const colorMode = useAppSelector((state: RootState) => state.color.mode);

  const setColorMode = (colorMode: 'dark' | 'light') => {
    dispatch(setMode(colorMode));
  };

  return {
    colorMode: colorMode === 'none' ? prefersColorMode : colorMode,
    setColorMode,
  };
};

export default useColorMode;
