import { Masonry } from '@mui/lab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import { useQueryClient } from '@tanstack/react-query';
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
import useLexioDivinas, {
  LEXIO_DIVINAS_QUERY_KEY,
} from 'hooks/api/useLexioDivinas';
import useAuth from 'hooks/auth/useAuth';
import useIsBreakpointsDown from 'hooks/theme/useIsBreakpointsDown';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { LexioDivina } from 'types/document';
import { addQuery, removeQuery } from 'utils/url';

type LexioDivinasProps = {
  fetchOptions?: {
    userId?: string;
  };
};

const PAGE_COUNT = 20;

const LexioDivinas: React.FC<LexioDivinasProps> = ({ fetchOptions }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { user, logout } = useAuth();
  const isSmall = useIsBreakpointsDown('sm');

  const [page, setPage] = useState(1);

  const [selectedLexioDivinaIdForDelete, setSelectedLexioDivinaIdForDelete] =
    useState<string | null>(null);

  const lexioDivinasParams = {
    skip: (page - 1) * PAGE_COUNT,
    limit: PAGE_COUNT,
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
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINAS_QUERY_KEY] });
    } catch (error) {
      enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
        variant: 'error',
      });
    } finally {
      setSelectedLexioDivinaIdForDelete(null);
    }
  };

  const addLike = async (id: string) => {
    if (!user) return;

    try {
      await postLikedToLexioDivina(id, {
        userId: user._id,
      });
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINAS_QUERY_KEY] });
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

  const deleteLike = async (id: string) => {
    if (!user) return;

    try {
      await deleteLikedInLexioDivina(id, user._id);
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINAS_QUERY_KEY] });
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
    const mutatedUrl = addQuery(router.asPath, `comments=${lexioDivina._id}`);
    router.push(mutatedUrl);
  };

  const handleCommentDrawerClose = () => {
    const mutatedUrl = removeQuery(router.asPath, 'comments');
    router.push(mutatedUrl);
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
      {!isSmall ? (
        <Box
          component="main"
          maxWidth="xl"
          sx={{
            py: 2,
            pl: 2,
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
                likeButtonDisabled={!user}
                onIsLikedSubmit={(isLiked) =>
                  isLiked
                    ? addLike(lexioDivina._id)
                    : deleteLike(lexioDivina._id)
                }
                likedCount={lexioDivina.likedUserIds.length}
                commentCount={lexioDivina.comments.length}
                onCommentButtonClick={() =>
                  handleCommentButtonClick(lexioDivina)
                }
                onUserClick={() => handleUserClick(lexioDivina.user._id)}
                createdAt={lexioDivina.createdAt}
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
      ) : null}

      {/* mobile view */}
      {isSmall ? (
        <Container
          component="main"
          maxWidth="sm"
          sx={{
            px: { xs: 0 },
            pt: 1,
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
                likeButtonDisabled={!user}
                onIsLikedSubmit={(isLiked) =>
                  isLiked
                    ? addLike(lexioDivina._id)
                    : deleteLike(lexioDivina._id)
                }
                likedCount={lexioDivina.likedUserIds.length}
                commentCount={lexioDivina.comments.length}
                onCommentButtonClick={() =>
                  handleCommentButtonClick(lexioDivina)
                }
                onUserClick={() => handleUserClick(lexioDivina.user._id)}
                createdAt={lexioDivina.createdAt}
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
      ) : null}

      <CommentDrawer
        id={
          typeof router.query?.comments === 'string'
            ? router.query?.comments
            : null
        }
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
