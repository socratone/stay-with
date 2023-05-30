import { MutableRefObject, useEffect } from 'react';

type UseResizeObserverParams = {
  ref: MutableRefObject<HTMLDivElement | null>;
  onResize: () => void;
  debounceTime?: number;
};

/**
 * Element resize event
 */
const useResizeObserver = ({
  ref,
  onResize,
  debounceTime = 250,
}: UseResizeObserverParams) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let resizeObserver: ResizeObserver;
    const element = ref.current;

    const handleResize = () => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        onResize();
      }, debounceTime);
    };

    if (element) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === element) {
            handleResize();
          }
        }
      });

      resizeObserver.observe(element);
    }
    return () => {
      clearTimeout(timer);
      if (element) {
        resizeObserver.unobserve(element);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceTime, ref]);
};

export default useResizeObserver;
