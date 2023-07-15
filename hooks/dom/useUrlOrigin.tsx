import { useEffect, useState } from 'react';

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/URL/origin
 */
const useUrlOrigin = () => {
  const [urlOrigin, setUrlOrigin] = useState('');

  useEffect(() => {
    setUrlOrigin(window.location.origin);
  }, []);

  return urlOrigin;
};

export default useUrlOrigin;
