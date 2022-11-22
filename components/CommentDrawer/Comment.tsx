import { Avatar, Box, Typography } from '@mui/material';

interface CommentProps {
  image?: string;
  name: string;
  message: string;
}

const Comment: React.FC<CommentProps> = ({ image, name, message }) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      {image ? (
        <Avatar alt="Profile" src={image} />
      ) : (
        <Avatar sx={{ width: 34, height: 34 }}>{name?.[0] ?? 'P'}</Avatar>
      )}
      <Typography>{message}</Typography>
    </Box>
  );
};

export default Comment;
