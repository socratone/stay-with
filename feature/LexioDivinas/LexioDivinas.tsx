import { Masonry } from '@mui/lab';
import Box from '@mui/material/Box';
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
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParam } from 'react-use';
import { LexioDivina } from 'types/document';
import { addQuery, removeQuery } from 'utils/url';

type LexioDivinasProps = {
  fetchOptions?: {
    userId?: string;
  };
};

const ITEM_COUNT_PER_PAGE = 20;

const LexioDivinas: React.FC<LexioDivinasProps> = ({ fetchOptions }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user, logout } = useAuth();

  const page = Number(useSearchParam('page')) || 1;

  const [selectedLexioDivinaIdForDelete, setSelectedLexioDivinaIdForDelete] =
    useState<string | null>(null);

  const {
    data: lexioDivinasData,
    isLoading: lexioDivinasLoading,
    isError: lexioDivinasError,
  } = useLexioDivinas({
    skip: (page - 1) * ITEM_COUNT_PER_PAGE,
    limit: ITEM_COUNT_PER_PAGE,
    userId: fetchOptions?.userId,
  });

  const lexioDivinas = lexioDivinasData?.lexioDivinas ?? [];

  const handleEdit = (id: string) => {
    router.push(`/lexio-divinas/${id}/edit`);
  };

  const handleLexioDivinaDelete = async () => {
    if (!selectedLexioDivinaIdForDelete) return;

    const lexioDivinaId = selectedLexioDivinaIdForDelete;
    setSelectedLexioDivinaIdForDelete(null);

    try {
      await deleteLexioDivina(lexioDivinaId);
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINAS_QUERY_KEY] });
    } catch (error) {
      enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
        variant: 'error',
      });
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

  const handlePageChange = (page: number) => {
    const mutatedUrl = addQuery(router.asPath, `page=${page}`);
    router.push(mutatedUrl);
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
      <Box
        component="main"
        maxWidth="xl"
        sx={{
          py: 2,
          pl: 2,
          mx: 'auto',
        }}
      >
        <Masonry spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
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
                isLiked ? addLike(lexioDivina._id) : deleteLike(lexioDivina._id)
              }
              likedCount={lexioDivina.likedUserIds.length}
              commentCount={lexioDivina.comments.length}
              onCommentButtonClick={() => handleCommentButtonClick(lexioDivina)}
              onUserClick={() => handleUserClick(lexioDivina.user._id)}
              createdAt={lexioDivina.createdAt}
            />
          ))}
        </Masonry>

        <Box display="flex" justifyContent="center">
          {(lexioDivinasData?.total ?? 0) <= ITEM_COUNT_PER_PAGE ? null : (
            <Pagination
              page={page}
              onChange={(_, page) => handlePageChange(page)}
              count={Math.ceil(
                Number(lexioDivinasData?.total) / ITEM_COUNT_PER_PAGE
              )}
            />
          )}
        </Box>
      </Box>

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
