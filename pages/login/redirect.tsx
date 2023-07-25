import Box from '@mui/material/Box';
import ErrorMessage from 'components/ErrorMessage';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import WaitingMessage from 'components/WaitingMessage';
import useKakaoLoginRedirect from 'hooks/auth/useKakaoLoginRedirect';
import useQueryString from 'hooks/url/useQueryString';

const LoginRedirect = () => {
  const { code } = useQueryString();
  const { isError } = useKakaoLoginRedirect(String(code));

  return (
    <Box
      height={`calc(100vh - ${GLOBAL_HEADER_HEIGHT})`}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {isError ? <ErrorMessage /> : <WaitingMessage />}
    </Box>
  );
};

export default LoginRedirect;
