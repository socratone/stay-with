import Box from '@mui/material/Box';
import ErrorMessage from 'components/ErrorMessage';
import WaitingMessage from 'components/WaitingMessage';
import useKakaoLoginRedirect from 'hooks/auth/useKakaoLoginRedirect';
import useQueryString from 'hooks/url/useQueryString';

const LoginRedirect = () => {
  const { code } = useQueryString();
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
