import { useEffect, useRef, useState } from 'react';

type Direction = 'up' | 'none' | 'down';

const useScrollDirection = () => {
  const previousScrollYRef = useRef(0);
  const isRequestedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timer>();

  const [direction, setDirection] = useState<Direction>('none');

  useEffect(() => {
    previousScrollYRef.current = window.scrollY;
  }, []);

  useEffect(() => {
    const requestUpdate = () => {
      const previousScrollY = previousScrollYRef.current;

      if (previousScrollY > window.scrollY) {
        setDirection('up');
      } else {
        setDirection('down');
      }

      previousScrollYRef.current = window.scrollY;

      timerRef.current = setTimeout(() => {
        isRequestedRef.current = false;
      }, 50);
    };

    const onScroll = () => {
      if (!isRequestedRef.current) {
        requestUpdate();
        isRequestedRef.current = true;
      }
    };

    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);

      const timer = timerRef.current;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return {
    scrollDirection: direction,
  };
};

export default useScrollDirection;
