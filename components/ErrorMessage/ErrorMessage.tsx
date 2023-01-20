import { Box, Typography } from '@mui/material';

const ErrorMessage = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Typography color="text.primary">에러가 발생했어요 😧</Typography>
    </Box>
  );
};

export default ErrorMessage;
