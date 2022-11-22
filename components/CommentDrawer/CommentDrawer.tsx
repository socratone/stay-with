import { Box, Drawer, IconButton } from '@mui/material';
import { Comment, User } from '../../libs/firebase/interfaces';
import CommentItem from './CommentItem';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import FilledTextField from '../FilledTextField';
import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

interface CommentDrawerProps {
  open: boolean;
  onClose: () => void;
  comments: Comment[];
  onMessageSend: (message: string) => void;
  onMessgeDelete: (comment: Comment) => void;
  user: User | null;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  open,
  onClose,
  comments,
  onMessageSend,
  onMessgeDelete,
  user,
}) => {
  const [message, setMessage] = useState('');
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<
    number | null
  >(null);
  const comment =
    selectedCommentIndex === null ? null : comments[selectedCommentIndex];

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendButtonClick = () => {
    if (message.trim().length === 0) return;
    onMessageSend(message);
    setMessage('');
    setSelectedCommentIndex(null);
    onClose(); // TODO: 닫지 않고 바로 보여줄 수 있도록 state를 쪼개야 한다.
  };

  const handleDeleteButtonClick = () => {
    if (!comment) return;
    onMessgeDelete(comment);
    setSelectedCommentIndex(null);
    onClose(); // TODO: 닫지 않고 바로 보여줄 수 있도록 state를 쪼개야 한다.
  };

  const handleCommentItemClick = (index: number) => {
    setSelectedCommentIndex(index);
  };

  const getDeleteButtonDisabled = () => {
    if (!comment) return true;
    if (user?.id === comment.user.id) {
      return false;
    }
    return true;
  };

  const handleClose = () => {
    onClose();
    setSelectedCommentIndex(null);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '50%', md: '30%' },
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          component="header"
          my={-1}
          display="flex"
          justifyContent="space-between"
          p={2}
        >
          <IconButton onClick={handleClose} sx={{ ml: -1 }}>
            <CloseIcon />
          </IconButton>
          {selectedCommentIndex !== null && (
            <IconButton
              onClick={handleDeleteButtonClick}
              disabled={getDeleteButtonDisabled()}
              sx={{ mr: -1 }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        <Box
          component="main"
          display="flex"
          flexDirection="column"
          flexGrow={1}
          overflow="auto"
        >
          {comments.map((comment, index) => (
            <CommentItem
              key={index}
              image={comment.user.image}
              name={comment.user.name}
              message={comment.message}
              isSelected={index === selectedCommentIndex}
              onClick={() => handleCommentItemClick(index)}
            />
          ))}
        </Box>

        <Box
          component="footer"
          display="flex"
          p={2}
          alignItems="center"
          gap={1}
        >
          <FilledTextField
            value={message}
            onChange={handleMessageChange}
            fullWidth
          />
          <Box mr={-1}>
            <IconButton onClick={handleSendButtonClick}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CommentDrawer;
