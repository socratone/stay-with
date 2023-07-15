import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useQueryClient } from '@tanstack/react-query';
import AlertDialog from 'components/AlertDialog';
import ErrorMessage from 'components/ErrorMessage';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import LexioDivinaCard from 'components/LexioDivinaCard';
import LoadingCircular from 'components/LoadingCircular';
import MessageInput from 'components/MessageInput';
import MessageInputStickyContainer from 'components/MessageInput/MessageInputStickyContainer';
import MessageItem from 'components/MessageItem';
import Meta from 'components/Meta';
import { LEXIO_DIVINA_COMMENT_VALIDATION } from 'constants/validation';
import {
  deleteCommentInLexioDivina,
  deleteLexioDivina,
  deleteLikedInLexioDivina,
  postCommentToLexioDivina,
  postLikedToLexioDivina,
} from 'helpers/axios';
import useLexioDivina, {
  LEXIO_DIVINA_QUERY_KEY,
} from 'hooks/api/useLexioDivina';
import useLexioDivinaComments, {
  LEXIO_DIVINA_COMMENTS_QUERY_KEY,
} from 'hooks/api/useLexioDivinaComments';
import { LEXIO_DIVINAS_QUERY_KEY } from 'hooks/api/useLexioDivinas';
import { LEXIO_DIVINAS_COUNT_QUERY_KEY } from 'hooks/api/useLexioDivinasCount';
import useAuth from 'hooks/auth/useAuth';
import useUrlOrigin from 'hooks/dom/useUrlOrigin';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { copyToClipboard } from 'utils/clipboard';

type Dialog = {
  id: string;
  open: boolean;
};

const LexioDivinaDetail = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const lexioDivinaId =
    typeof router.query.lexioId === 'string' ? router.query.lexioId : undefined;
  const queryClient = useQueryClient();
  const urlOrigin = useUrlOrigin();
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const { user: me, logout } = useAuth();

  const {
    data: lexioDivinaData,
    isLoading: lexioDivinaLoading,
    isError: lexioDivinaError,
  } = useLexioDivina(lexioDivinaId);

  const {
    data: lexioDivinaCommentsData,
    isLoading: lexioDivinaCommentsLoading,
    isError: lexioDivinaCommentsError,
  } = useLexioDivinaComments(lexioDivinaId);

  const lexioDivina = lexioDivinaData?.lexioDivina;
  const likedUserIds = lexioDivinaData?.lexioDivina.likedUserIds ?? [];
  const comments = lexioDivinaCommentsData?.comments;

  const isLoading = lexioDivinaLoading || lexioDivinaCommentsLoading;
  const isError = lexioDivinaError || lexioDivinaCommentsError;

  const [commentValue, setCommentValue] = useState('');
  const [commentDeleteDialog, setCommentDeleteDialog] = useState<Dialog | null>(
    null
  );
  const [lexioDivinaDeleteDialogOpen, setLexioDivinaDeleteDialogOpen] =
    useState(false);

  const handleLexioDivinaDelete = () => {
    setLexioDivinaDeleteDialogOpen(true);
  };

  const removeLexioDivina = async () => {
    if (!lexioDivinaId) return;
    setLexioDivinaDeleteDialogOpen(false);

    try {
      await deleteLexioDivina(lexioDivinaId);
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINAS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [LEXIO_DIVINAS_COUNT_QUERY_KEY],
      });
      router.push('/');
    } catch {
      //
    }
  };

  const enqueueNotLoggedInSnackbar = () => {
    enqueueSnackbar(formatMessage({ id: 'warning.message.notLoggedIn' }), {
      variant: 'warning',
    });
  };

  const addLike = async () => {
    if (!me) return enqueueNotLoggedInSnackbar();
    if (!lexioDivinaId) return;

    try {
      await postLikedToLexioDivina(lexioDivinaId, {
        userId: me._id,
      });
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINA_QUERY_KEY] });
    } catch {
      //
    }
  };

  const deleteLike = async () => {
    if (!me) return enqueueNotLoggedInSnackbar();
    if (!lexioDivinaId) return;

    try {
      await deleteLikedInLexioDivina(lexioDivinaId, me._id);
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINA_QUERY_KEY] });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      }
    }
  };

  const deleteComment = async () => {
    if (!lexioDivinaId || !commentDeleteDialog) return;
    try {
      await deleteCommentInLexioDivina(lexioDivinaId, commentDeleteDialog.id);
      queryClient.invalidateQueries({
        queryKey: [LEXIO_DIVINA_COMMENTS_QUERY_KEY],
      });
      setCommentDeleteDialog(null);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      }
    }
  };

  const handleCommentValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentValue(event.target.value);
  };

  const handleCommentSubmit = async () => {
    if (!me) return enqueueNotLoggedInSnackbar();
    if (!lexioDivinaId) return;

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
      await postCommentToLexioDivina(lexioDivinaId, {
        userId: me._id,
        message: trimedComment,
      });

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      queryClient.invalidateQueries({
        queryKey: [LEXIO_DIVINA_COMMENTS_QUERY_KEY],
      });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      }
    }
  };

  const handleCommentButtonClick = () => {
    if (!me) return enqueueNotLoggedInSnackbar();
    messageInputRef.current?.focus();
  };

  const handleAuthorClick = (id: string) => {
    router.push(`/users/${id}`);
  };

  const handleLexioDivinaEdit = () => {
    if (!lexioDivinaId) return;
    router.push(`/lexio-divinas/${lexioDivinaId}/edit`);
  };

  const handleCommentDelete = (id: string) => {
    setCommentDeleteDialog({ open: true, id });
  };

  return (
    <>
      <Meta />
      <GlobalHeader backButton />

      <Container
        maxWidth="sm"
        sx={{ pt: 2, height: `calc(100% - ${GLOBAL_HEADER_HEIGHT})` }}
      >
        <Stack height="100%">
          {isError ? (
            <ErrorMessage />
          ) : isLoading ? (
            <LoadingCircular />
          ) : lexioDivina && comments ? (
            <>
              <LexioDivinaCard
                name={lexioDivina.user.name}
                profileImageUrl={lexioDivina.user.imageUrl}
                phrase={lexioDivina.phrase}
                bible={lexioDivina.bible}
                chapter={lexioDivina.chapter}
                verse={lexioDivina.verse}
                endChapter={lexioDivina.endChapter}
                endVerse={lexioDivina.endVerse}
                content={lexioDivina.content}
                isMine={lexioDivina.userId === me?._id}
                isLiked={!!likedUserIds.find((id) => id === me?._id)}
                onEditMenuItemClick={handleLexioDivinaEdit}
                onDeleteMenuItemClick={handleLexioDivinaDelete}
                likeButtonDisabled={!me}
                onIsLikedSubmit={(isLiked) =>
                  isLiked ? addLike() : deleteLike()
                }
                likedCount={likedUserIds.length}
                commentCount={comments.length}
                onCommentButtonClick={handleCommentButtonClick}
                onUserClick={() => handleAuthorClick(lexioDivina.userId)}
                createdAt={lexioDivina.createdAt}
                onShareButtonClick={() =>
                  copyToClipboard(
                    `${urlOrigin}/lexio-divinas/${lexioDivina._id}`,
                    {
                      targetName: '링크',
                    }
                  )
                }
              />
              <Stack gap={1} mt={2} flexGrow={1}>
                {comments
                  .map((comment) => (
                    <MessageItem
                      key={comment._id}
                      profileImageUrl={comment.imageUrl}
                      name={comment.name}
                      message={comment.message}
                      createdAt={comment.createdAt}
                      isMyself={comment.userId === me?._id}
                      onDelete={() => handleCommentDelete(comment._id)}
                    />
                  ))
                  .reverse()}
                {me ? (
                  <MessageInputStickyContainer>
                    <MessageInput
                      ref={messageInputRef}
                      value={commentValue}
                      onChange={handleCommentValueChange}
                      onSubmit={handleCommentSubmit}
                    />
                  </MessageInputStickyContainer>
                ) : null}
              </Stack>
            </>
          ) : null}
        </Stack>
      </Container>

      <AlertDialog
        open={lexioDivinaDeleteDialogOpen}
        onClose={() => setLexioDivinaDeleteDialogOpen(false)}
        onSubmit={removeLexioDivina}
        title="삭제 확인"
        description="묵상글을 삭제하시겠습니까?"
        color="error"
      />

      <AlertDialog
        open={!!commentDeleteDialog}
        title="삭제 확인"
        description="댓글을 삭제하시겠습니까?"
        onClose={() => setCommentDeleteDialog(null)}
        onSubmit={deleteComment}
        color="error"
      />
    </>
  );
};

export default LexioDivinaDetail;
