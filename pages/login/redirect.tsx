import Box from '@mui/material/Box';
import ErrorMessage from 'components/ErrorMessage';
import WaitingMessage from 'components/WaitingMessage';
import useKakaoLoginRedirect from 'hooks/auth/useKakaoLoginRedirect';
import { useRouter } from 'next/router';
import queryString from 'query-string';

const LoginRedirect = () => {
  const router = useRouter();
  const [, rawQueryString] = router.asPath.split('?');
  const { code } = queryString.parse(rawQueryString);
  const { isError } = useKakaoLoginRedirect(String(code));

  return (
    <>
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {isError ? <ErrorMessage /> : <WaitingMessage />}
      </Box>
    </>
  );
};

export default LoginRedirect;
