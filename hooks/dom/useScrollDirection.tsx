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

      setDirection(previousScrollY > window.scrollY ? 'up' : 'down');
      previousScrollYRef.current = window.scrollY;
      timerRef.current = setTimeout(() => {
        isRequestedRef.current = false;
      }, 50);
    };

    const onScroll = () => {
      // 아이폰 flexible 스크롤 방지
      if (window.scrollY <= 0) return;

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
