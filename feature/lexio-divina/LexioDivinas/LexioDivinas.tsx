import { Masonry } from '@mui/lab';
import Box from '@mui/material/Box';
import { useQueryClient } from '@tanstack/react-query';
import AlertDialog from 'components/AlertDialog';
import ErrorMessage from 'components/ErrorMessage';
import LexioDivinaCard from 'components/LexioDivinaCard';
import LexioDivinaLoadingCard from 'components/LexioDivinaLoadingCard';
import {
  deleteLexioDivina,
  deleteLikedInLexioDivina,
  postLikedToLexioDivina,
} from 'helpers/axios';
import useLexioDivinas, {
  LEXIO_DIVINAS_QUERY_KEY,
} from 'hooks/api/useLexioDivinas';
import { LEXIO_DIVINAS_COUNT_QUERY_KEY } from 'hooks/api/useLexioDivinasCount';
import useAuth from 'hooks/auth/useAuth';
import useUrlOrigin from 'hooks/dom/useUrlOrigin';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { LexioDivina } from 'schemas';
import { copyToClipboard } from 'utils/clipboard';

type LexioDivinasProps = {
  page: number;
  countPerPage: number;
  filter?: {
    userId?: string;
  };
};

const LexioDivinas: React.FC<LexioDivinasProps> = ({
  page,
  countPerPage,
  filter,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const urlOrigin = useUrlOrigin();

  const { user, logout } = useAuth();

  const [selectedLexioDivinaIdForDelete, setSelectedLexioDivinaIdForDelete] =
    useState<string | null>(null);

  const {
    data: lexioDivinasData,
    isLoading: lexioDivinasLoading,
    isError: lexioDivinasError,
  } = useLexioDivinas({
    skip: (page - 1) * countPerPage,
    limit: countPerPage,
    userId: filter?.userId,
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
      queryClient.invalidateQueries({
        queryKey: [LEXIO_DIVINAS_COUNT_QUERY_KEY],
      });
    } catch {
      //
    }
  };

  const addLike = async (id: string) => {
    if (!user) return;

    try {
      await postLikedToLexioDivina(id, {
        userId: user._id,
      });
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINAS_QUERY_KEY] });
    } catch {
      //
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
      }
    }
  };

  const handleCommentButtonClick = (lexioDivina: LexioDivina) => {
    router.push(`/lexio-divinas/${lexioDivina._id}`);
  };

  const handleUserClick = (id: string) => {
    router.push(`/users/${id}`);
  };

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
          pt: 2,
          pl: 2,
          mx: 'auto',
        }}
      >
        <Masonry spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
          {lexioDivinasLoading ? (
            <>
              <LexioDivinaLoadingCard lineCount={8} />
              <LexioDivinaLoadingCard lineCount={16} />
              <LexioDivinaLoadingCard lineCount={24} />
              <LexioDivinaLoadingCard lineCount={16} />
              <LexioDivinaLoadingCard lineCount={8} />
              <LexioDivinaLoadingCard lineCount={16} />
              <LexioDivinaLoadingCard lineCount={24} />
              <LexioDivinaLoadingCard lineCount={16} />
              <LexioDivinaLoadingCard lineCount={8} />
            </>
          ) : (
            lexioDivinas.map((lexioDivina) => (
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
                moreHref={`/lexio-divinas/${lexioDivina._id}`}
                maxContentLength={500}
                onShareButtonClick={() =>
                  copyToClipboard(
                    `${urlOrigin}/lexio-divinas/${lexioDivina._id}`,
                    {
                      targetName: '링크',
                    }
                  )
                }
              />
            ))
          )}
        </Masonry>
      </Box>

      <AlertDialog
        open={!!selectedLexioDivinaIdForDelete}
        onClose={() => setSelectedLexioDivinaIdForDelete(null)}
        onSubmit={handleLexioDivinaDelete}
        title={formatMessage({ id: 'alert.delete.title' })}
        description="묵상글을 삭제하시겠습니까?"
        color="error"
      />
    </>
  );
};

export default LexioDivinas;
