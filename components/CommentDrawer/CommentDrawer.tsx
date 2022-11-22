import { Box, Drawer, IconButton } from '@mui/material';
import { User } from '../../libs/firebase/interfaces';
import Comment from './Comment';
import CloseIcon from '@mui/icons-material/Close';

interface CommentDrawerProps {
  open: boolean;
  onClose: () => void;
  comments: {
    id: string;
    user: User;
    message: string;
  }[];
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  open,
  onClose,
  comments,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '50%', md: '30%' },
          p: 2,
        },
      }}
    >
      <Box display="flex" flexDirection="column" gap={1}>
        <Box ml={-1} mt={-1}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            image={comment.user.image}
            name={comment.user.name}
            message={comment.message}
          />
        ))}
      </Box>
    </Drawer>
  );
};

export default CommentDrawer;
