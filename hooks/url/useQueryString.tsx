import { useRouter } from 'next/router';
import queryString from 'query-string';

const useQueryString = () => {
  const router = useRouter();
  const [, rawQueryString] = router.asPath.split('?');
  return queryString.parse(rawQueryString);
};

export default useQueryString;
