import { Box, Drawer, IconButton } from '@mui/material';
import { Comment } from '../../libs/firebase/interfaces';
import CommentItem from './CommentItem';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import FilledTextField from '../../components/FilledTextField';
import { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

import AlertDialog from '../../components/AlertDialog';
import useAuth from '../../hooks/context/useAuth';
import usePost from '../../hooks/api/usePost';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingCircular from '../../components/LoadingCircular';
import { deleteCommentInPost, postCommentToPost } from 'libs/axios/apis';

interface CommentDrawerProps {
  open: boolean;
  postId?: string;
  onClose: () => void;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  open,
  postId,
  onClose,
}) => {
  const { user } = useAuth();
  const { post, isError, isLoading, mutate } = usePost(postId);
  const comments = post?.comments ?? [];

  const [commentValue, setCommentValue] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const [selectedCommentIdForDelete, setSelectedCommentIdForDelete] = useState<
    string | null
  >(null);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentValue(event.target.value);
  };

  const handleCommentDelete = async () => {
    if (!postId || !user || !selectedCommentIdForDelete) return;
    try {
      await deleteCommentInPost(postId, selectedCommentIdForDelete);
      mutate();
      setSelectedCommentIdForDelete(null);
      setSelectedCommentId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSend = async () => {
    if (!postId || !user) return;
    const trimedComment = commentValue.trim();
    if (trimedComment.length === 0) return;
    setCommentValue('');

    try {
      const now = new Date().getTime();
      await postCommentToPost(postId, {
        user,
        message: trimedComment,
        createdAt: now,
      });
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteButtonClick = () => {
    setSelectedCommentIdForDelete(selectedCommentId);
  };

  const handleCommentItemClick = (commentId: string) => {
    setSelectedCommentId(commentId);
  };

  const handleClose = () => {
    onClose();
    setSelectedCommentId(null);
  };

  const getDeleteButtonDisabled = () => {
    if (!selectedCommentId) return true;
    const selectedComment = comments.find(
      (comment) => comment.id === selectedCommentId
    );
    if (user?.id === selectedComment?.user.id) {
      return false;
    }
    return true;
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: { xs: '100%', sm: 400, md: 400 },
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
            {selectedCommentId !== null && (
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
            {isError ? (
              <ErrorMessage />
            ) : isLoading ? (
              <LoadingCircular />
            ) : (
              comments
                .map((comment) => (
                  <CommentItem
                    key={comment.id}
                    image={comment.user.image}
                    name={comment.user.name}
                    message={comment.message}
                    isSelected={comment.id === selectedCommentId}
                    onClick={() => handleCommentItemClick(comment.id)}
                  />
                ))
                .reverse()
            )}
          </Box>

          <Box
            component="footer"
            display="flex"
            p={2}
            alignItems="center"
            gap={1}
          >
            <FilledTextField
              value={commentValue}
              onChange={handleCommentChange}
              fullWidth
            />
            <Box mr={-1}>
              <IconButton onClick={handleCommentSend}>
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Drawer>

      <AlertDialog
        open={!!selectedCommentIdForDelete}
        onClose={() => setSelectedCommentIdForDelete(null)}
        onSubmit={handleCommentDelete}
        title="삭제 확인"
        description="댓글을 삭제하시겠습니까?"
      />
    </>
  );
};

export default CommentDrawer;
