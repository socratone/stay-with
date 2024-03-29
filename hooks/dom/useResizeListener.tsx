import { useEffect } from 'react';

type UseResizeListenerParams = {
  /** useCallback으로 감싼 함수여야 한다. */
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
  }, [debounceTime, onResize]);
};

export default useResizeListener;
