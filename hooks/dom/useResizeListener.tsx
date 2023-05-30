import { useEffect } from 'react';

type UseResizeListenerParams = {
  onResize: () => void;
  debounceTime?: number;
};

/**
 * Window resize event
 */
const useResizeListener = ({
  onResize,
  debounceTime = 250,
}: UseResizeListenerParams) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        onResize();
      }, debounceTime);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceTime]);
};

export default useResizeListener;
