import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const ExpiredMessage = () => {
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
      <Typography
        color="text.primary"
        textAlign="center"
        sx={{ whiteSpace: 'pre-line' }}
      >
        {'토큰이 만료됐어요 😥\n다시 로그인을 해주세요'}
      </Typography>
      <Button variant="outlined" onClick={handleClick}>
        로그인하러 가기
      </Button>
    </Box>
  );
};

export default ExpiredMessage;
