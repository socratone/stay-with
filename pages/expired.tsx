import { Box } from '@mui/material';
import ExpiredMessage from 'components/ExpiredMessage';

const Expired = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <ExpiredMessage />
    </Box>
  );
};

export default Expired;
