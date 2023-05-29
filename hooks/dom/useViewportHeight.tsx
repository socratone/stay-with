import { useEffect } from 'react';

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

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
};

export default useViewportHeight;
