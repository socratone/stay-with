import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ErrorMessage = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Typography color="text.primary">에러가 발생했어요 😧</Typography>
    </Box>
  );
};

export default ErrorMessage;
