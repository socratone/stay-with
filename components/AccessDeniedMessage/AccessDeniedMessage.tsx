import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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
