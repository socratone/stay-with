import { Masonry } from '@mui/lab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import AlertDialog from 'components/AlertDialog';
import ErrorMessage from 'components/ErrorMessage';
import LexioDivinaCard from 'components/LexioDivinaCard';
import LoadingCircular from 'components/LoadingCircular';
import CommentDrawer from 'feature/CommentDrawer';
import {
  deleteLexioDivina,
  deleteLikedInLexioDivina,
  postLikedToLexioDivina,
} from 'helpers/axios';
import useLexioDivinas from 'hooks/api/useLexioDivinas';
import useAuth from 'hooks/context/useAuth';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { LexioDivina } from 'types/document';

interface LexioDivinasProps {
  fetchOptions?: {
    userId?: string;
  };
}

const PAGE_COUNT = 20;
export const LEXIO_DIVINAS_KEY = { queryKey: '/api/lexio-divinas' };

const LexioDivinas: React.FC<LexioDivinasProps> = ({ fetchOptions }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const [selectedLexioDivinaIdForDelete, setSelectedLexioDivinaIdForDelete] =
    useState<string | null>(null);
  const [selectedLexioDivinaForComment, setSelectedLexioDivinaForComment] =
    useState<LexioDivina | null>(null);

  const lexioDivinasParams = {
    offset: page,
    count: PAGE_COUNT,
    userId: fetchOptions?.userId,
  };

  const {
    data: lexioDivinasData,
    isLoading: lexioDivinasLoading,
    isError: lexioDivinasError,
  } = useLexioDivinas(lexioDivinasParams);

  const lexioDivinas = lexioDivinasData?.lexioDivinas ?? [];

  const handleEdit = (id: string) => {
    router.push(`/lexio-divinas/${id}/edit`);
  };

  const handleLexioDivinaDelete = async () => {
    if (!selectedLexioDivinaIdForDelete) return;

    try {
      await deleteLexioDivina(selectedLexioDivinaIdForDelete);
      queryClient.invalidateQueries(LEXIO_DIVINAS_KEY);
    } catch (error) {
      enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
        variant: 'error',
      });
    } finally {
      setSelectedLexioDivinaIdForDelete(null);
    }
  };

  const handleLike = async (id: string) => {
    if (!user) return;

    try {
      await postLikedToLexioDivina(id, {
        userId: user._id,
      });
      queryClient.invalidateQueries(LEXIO_DIVINAS_KEY);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      } else {
        enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
          variant: 'error',
        });
      }
    }
  };

  const handleUnlike = async (id: string) => {
    if (!user) return;

    try {
      await deleteLikedInLexioDivina(id, user._id);
      queryClient.invalidateQueries(LEXIO_DIVINAS_KEY);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      } else {
        enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
          variant: 'error',
        });
      }
    }
  };

  const handleCommentButtonClick = (lexioDivina: LexioDivina) => {
    setSelectedLexioDivinaForComment(lexioDivina);
  };

  const handleCommentDrawerClose = () => {
    setSelectedLexioDivinaForComment(null);
  };

  const handleUserClick = (id: string) => {
    router.push(`/user/${id}`);
  };

  if (lexioDivinasLoading) {
    return (
      <Box p={2}>
        <LoadingCircular />
      </Box>
    );
  }

  if (lexioDivinasError) {
    return (
      <Box p={2}>
        <ErrorMessage />
      </Box>
    );
  }

  return (
    <>
      {/* desktop, tablet view */}
      <Box
        component="main"
        maxWidth="xl"
        sx={{
          py: 2,
          pl: 2,
          display: { xs: 'none', sm: 'block', md: 'block', xl: 'block' },
        }}
      >
        <Masonry spacing={2} columns={{ sm: 2, md: 3, lg: 4 }}>
          {lexioDivinas.map((lexioDivina) => (
            <LexioDivinaCard
              key={lexioDivina._id}
              name={lexioDivina.user.name}
              profileImageUrl={lexioDivina.user.imageUrl}
              phrase={lexioDivina.phrase}
              bible={lexioDivina.bible}
              chapter={lexioDivina.chapter}
              verse={lexioDivina.verse}
              endChapter={lexioDivina.endChapter}
              endVerse={lexioDivina.endVerse}
              content={lexioDivina.content}
              isMine={lexioDivina.user._id === user?._id}
              isLiked={
                !!lexioDivina.likedUserIds.find((id) => id === user?._id)
              }
              onEditMenuItemClick={() => handleEdit(lexioDivina._id)}
              onDeleteMenuItemClick={() =>
                setSelectedLexioDivinaIdForDelete(lexioDivina._id)
              }
              // TODO: 계속 클릭해도 한 번만 요청하도록
              onLikeButtonClick={() => handleLike(lexioDivina._id)}
              onUnlikeButtonClick={() => handleUnlike(lexioDivina._id)}
              likedCount={lexioDivina.likedUserIds.length}
              commentCount={lexioDivina.comments.length}
              onCommentButtonClick={() => handleCommentButtonClick(lexioDivina)}
              onUserClick={() => handleUserClick(lexioDivina.user._id)}
            />
          ))}
        </Masonry>

        <Box display="flex" justifyContent="center">
          {lexioDivinasData?.total ?? 0 <= PAGE_COUNT ? null : (
            <Pagination
              page={page}
              onChange={(_, page) => setPage(page)}
              count={Math.ceil(Number(lexioDivinasData?.total) / PAGE_COUNT)}
            />
          )}
        </Box>
      </Box>

      {/* mobile view */}
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          px: { xs: 0 },
          pt: 1,
          display: { xs: 'block', sm: 'none', md: 'none', xl: 'none' },
        }}
      >
        {lexioDivinas?.map((lexioDivina) => (
          <Box key={lexioDivina._id} pt={1} pb={1} px={2}>
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
              isMine={lexioDivina.user.email === user?.email}
              isLiked={
                !!lexioDivina.likedUserIds.find((id) => id === user?._id)
              }
              onEditMenuItemClick={() => handleEdit(lexioDivina._id)}
              onDeleteMenuItemClick={() =>
                setSelectedLexioDivinaIdForDelete(lexioDivina._id)
              }
              // TODO: 계속 클릭해도 한 번만 요청하도록
              onLikeButtonClick={() => handleLike(lexioDivina._id)}
              onUnlikeButtonClick={() => handleUnlike(lexioDivina._id)}
              likedCount={lexioDivina.likedUserIds.length}
              commentCount={lexioDivina.comments.length}
              onCommentButtonClick={() => handleCommentButtonClick(lexioDivina)}
              onUserClick={() => handleUserClick(lexioDivina.user._id)}
            />
          </Box>
        ))}

        <Box display="flex" justifyContent="center">
          {lexioDivinasData?.total ?? 0 <= PAGE_COUNT ? null : (
            <Pagination
              page={page}
              onChange={(_, page) => setPage(page)}
              count={Math.ceil(Number(lexioDivinasData?.total) / PAGE_COUNT)}
            />
          )}
        </Box>
      </Container>

      <CommentDrawer
        open={!!selectedLexioDivinaForComment}
        id={selectedLexioDivinaForComment?._id}
        onClose={handleCommentDrawerClose}
      />

      <AlertDialog
        open={!!selectedLexioDivinaIdForDelete}
        onClose={() => setSelectedLexioDivinaIdForDelete(null)}
        onSubmit={handleLexioDivinaDelete}
        title="삭제 확인"
        description="묵상글을 삭제하시겠습니까?"
        color="error"
      />
    </>
  );
};

export default LexioDivinas;
