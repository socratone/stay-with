import { Box, CircularProgress, Typography } from '@mui/material';

const WaitingMessage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={1}
    >
      <CircularProgress />
      <Typography>잠시만 기다려주세요 😎</Typography>
    </Box>
  );
};

export default WaitingMessage;
