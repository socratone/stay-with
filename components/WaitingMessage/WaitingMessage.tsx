import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

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
      <Typography color="text.primary">잠시만 기다려주세요 😎</Typography>
    </Box>
  );
};

export default WaitingMessage;
