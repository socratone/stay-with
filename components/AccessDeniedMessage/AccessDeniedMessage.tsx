import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const AccessDeniedMessage = () => {
  const router = useRouter();

  const handleClick = () => router.push('/');

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={1}
    >
      <Typography color="text.primary">잘못된 접근입니다 😇</Typography>
      <Button variant="outlined" onClick={handleClick}>
        홈으로 가기
      </Button>
    </Box>
  );
};

export default AccessDeniedMessage;
