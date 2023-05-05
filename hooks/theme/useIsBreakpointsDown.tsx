import { useMediaQuery, useTheme } from '@mui/material';

type Size =
  | 'xs' // 0
  | 'sm' // 600
  | 'md' // 900
  | 'lg' // 1200
  | 'xl'; // 1536

/**
 * viewport의 크기가 param으로 받는 size보다 작은지 아닌지를 boolean으로 return한다.
 */
const useIsBreakpointsDown = (size: Size) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(size));
};

export default useIsBreakpointsDown;
