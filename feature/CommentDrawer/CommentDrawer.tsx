import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AlertDialog from 'components/AlertDialog';
import ErrorMessage from 'components/ErrorMessage';
import LoadingCircular from 'components/LoadingCircular';
import { LEXIO_DIVINA_COMMENT_VALIDATION } from 'constants/validation';
import {
  deleteCommentInLexioDivina,
  postCommentToLexioDivina,
} from 'helpers/axios';
import useLexioDivina from 'hooks/api/useLexioDivina';
import useAuth from 'hooks/auth/useAuth';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';

import CommentItem from './CommentItem';

type CommentDrawerProps = {
  id: string | null;
  onClose: () => void;
};

const CommentDrawer: React.FC<CommentDrawerProps> = ({ id, onClose }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    data: lexioDivinaData,
    isError,
    isLoading,
    refetch,
  } = useLexioDivina(id);
  const comments = lexioDivinaData?.lexioDivina.comments ?? [];

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
    if (!id || !user || !selectedCommentIdForDelete) return;
    try {
      await deleteCommentInLexioDivina(id, selectedCommentIdForDelete);
      refetch();
      setSelectedCommentIdForDelete(null);
      setSelectedCommentId(null);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      }
    }
  };

  const handleCommentSend = async () => {
    if (!id || !user) return;

    const { maxLength } = LEXIO_DIVINA_COMMENT_VALIDATION.message;
    const trimedComment = commentValue.trim();

    if (trimedComment.length === 0) {
      return enqueueSnackbar('값을 입력하세요 😔', {
        variant: 'error',
      });
    }

    if (trimedComment.length > maxLength) {
      return enqueueSnackbar(`${maxLength}자를 넘을 수 없어요 😂`, {
        variant: 'error',
      });
    }

    setCommentValue('');

    try {
      await postCommentToLexioDivina(id, {
        userId: user._id,
        message: trimedComment,
      });
      refetch();
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      }
    }
  };

  const handleDeleteButtonClick = () => {
    setSelectedCommentIdForDelete(selectedCommentId);
  };

  const handleCommentItemClick = (commentId: string) => {
    if (!user) return;
    setSelectedCommentId((previousId) =>
      previousId === commentId ? null : commentId
    );
  };

  const handleClose = () => {
    onClose();
    setSelectedCommentId(null);
  };

  const getDeleteButtonDisabled = () => {
    if (!selectedCommentId) return true;

    const selectedComment = comments.find(
      (comment) => comment._id === selectedCommentId
    );

    if (user?._id === selectedComment?.userId) {
      return false;
    }

    return true;
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={!!id}
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
                    key={comment._id}
                    imageUrl={comment.imageUrl}
                    name={comment.name}
                    message={comment.message}
                    createdAt={comment.createdAt}
                    isSelected={comment._id === selectedCommentId}
                    onClick={() => handleCommentItemClick(comment._id)}
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
            <TextField
              value={commentValue}
              onChange={handleCommentChange}
              size="small"
              fullWidth
              disabled={!user}
            />
            <Box mr={-1}>
              <IconButton onClick={handleCommentSend} disabled={!user}>
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
