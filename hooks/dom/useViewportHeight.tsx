import { useEffect } from 'react';

/**
 * 모바일 dynamic height 방지
 * https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
 */
const useViewportHeight = () => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const viewportHeight = window.innerHeight * 0.01;
        document.documentElement.style.setProperty(
          '--viewport-height',
          `${viewportHeight}px`
        );
      }, 200);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
};

export default useViewportHeight;
