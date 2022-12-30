import { Box } from '@mui/material';
import ErrorMessage from '../../components/ErrorMessage';
import WaitingMessage from '../../components/WaitingMessage';
import useGoogleLoginRedirect from '../../hooks/auth/useGoogleLoginRedirect';

const LoginRedirect = () => {
  const { isError } = useGoogleLoginRedirect();

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
