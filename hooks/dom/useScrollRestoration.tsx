import { useRouter } from 'next/router';
import { useEffect } from 'react';

const SCROLL_POSITION_KEY = 'scroll-position';

const useScrollRestoration = () => {
  const router = useRouter();

  // set scroll restoration to manual
  useEffect(() => {
    if (
      'scrollRestoration' in history &&
      history.scrollRestoration !== 'manual'
    ) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // handle and store scroll position
  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem(SCROLL_POSITION_KEY, window.scrollY.toString());
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // restore scroll position
  useEffect(() => {
    if (SCROLL_POSITION_KEY in sessionStorage) {
      setTimeout(() => {
        window.scrollTo(0, Number(sessionStorage.getItem(SCROLL_POSITION_KEY)));
        sessionStorage.removeItem(SCROLL_POSITION_KEY);
      }, 0);
    }
  }, []);
};

export default useScrollRestoration;
