import { Box, Typography } from '@mui/material';

const ErrorMessage = () => {
  return (
    <Box display="flex" justifyContent="center">
      <Typography color="error">에러가 발생했습니다.</Typography>
    </Box>
  );
};

export default ErrorMessage;
