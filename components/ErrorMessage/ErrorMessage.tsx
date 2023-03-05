import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ErrorMessageProps {
  content?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ content }) => {
  return (
    <Box display="flex" justifyContent="center">
      <Typography color="text.primary">
        {content ? content : '에러가 발생했어요 😧'}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;
