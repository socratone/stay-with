import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

const LoginMessage = () => {
  const router = useRouter();

  const handleClick = () => router.push('/login');

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={1}
    >
      <Typography color="text.primary">로그인이 필요합니다 😢</Typography>
      <Button variant="outlined" onClick={handleClick}>
        로그인하러 가기
      </Button>
    </Box>
  );
};

export default LoginMessage;
