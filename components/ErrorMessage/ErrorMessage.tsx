import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';

type ErrorMessageProps = {
  content?: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ content }) => {
  return (
    <Box display="flex" justifyContent="center">
      <Typography color="text.primary" textAlign="center">
        {content ? content : <FormattedMessage id="error.message.common" />}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;
