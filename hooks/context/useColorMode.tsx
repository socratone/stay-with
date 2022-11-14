import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ColorMode, setMode } from '../../redux/colorSlice';
import { useMediaQuery } from '@mui/material';

const useColorMode = () => {
  const dispatch = useDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const colorMode = useSelector((state: RootState) => state.color.mode);

  const prefersColorMode = prefersDarkMode ? 'dark' : 'light';

  const setColorMode = (colorMode: 'dark' | 'light') => {
    dispatch(setMode(colorMode));
  };

  return {
    colorMode: colorMode === 'none' ? prefersColorMode : colorMode,
    setColorMode,
  };
};

export default useColorMode;
