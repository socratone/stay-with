import Box from '@mui/material/Box';
import ErrorMessage from 'components/ErrorMessage';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import WaitingMessage from 'components/WaitingMessage';
import useKakaoLoginRedirect from 'hooks/auth/useKakaoLoginRedirect';
import useQueryString from 'hooks/url/useQueryString';

const LoginRedirect = () => {
  const { code } = useQueryString();
  const { error } = useKakaoLoginRedirect(String(code));

  const parseToErrorMessage = () => {
    let message = '😱 에러가 발생했어요. 관리자에게 문의해주세요.';
    if (error?.message) message += `\nmessage: ${error.message}`;
    if (error?.type) message += `\ntype: ${error.type}`;
    if (error?.code) message += `\ncode: ${error.code}`;
    return message;
  };

  return (
    <Box
      height={`calc(100vh - ${GLOBAL_HEADER_HEIGHT})`}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {error ? (
        <ErrorMessage content={parseToErrorMessage()} />
      ) : (
        <WaitingMessage />
      )}
    </Box>
  );
};

export default LoginRedirect;
