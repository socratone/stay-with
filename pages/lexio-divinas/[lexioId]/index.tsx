import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useQueryClient } from '@tanstack/react-query';
import AlertDialog from 'components/AlertDialog';
import ErrorMessage from 'components/ErrorMessage';
import GlobalHeader from 'components/GlobalHeader';
import LexioDivinaCard from 'components/LexioDivinaCard';
import LoadingCircular from 'components/LoadingCircular';
import MessageItem from 'components/MessageItem';
import Meta from 'components/Meta';
import { CollectionName } from 'constants/mongodb';
import {
  deleteCommentInLexioDivina,
  deleteLexioDivina,
  deleteLikedInLexioDivina,
  postLikedToLexioDivina,
} from 'helpers/axios';
import useLexioDivina, {
  LEXIO_DIVINA_QUERY_KEY,
} from 'hooks/api/useLexioDivina';
import { LEXIO_DIVINAS_QUERY_KEY } from 'hooks/api/useLexioDivinas';
import { LEXIO_DIVINAS_COUNT_QUERY_KEY } from 'hooks/api/useLexioDivinasCount';
import useAuth from 'hooks/auth/useAuth';
import { ObjectId } from 'mongodb';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { LexioDivina, User } from 'schemas';
import Mongodb from 'utils/mongodb';

type LexioDivinaDetailProps = {
  lexioDivina: AggregatedLexioDivina;
};

interface AggregatedLexioDivina extends LexioDivina {
  user: Omit<User, 'kakaoId' | 'email'>;
  createdAt: Date;
}

type Dialog = {
  id: string;
  open: boolean;
};

export const getServerSideProps: GetServerSideProps<
  LexioDivinaDetailProps
> = async ({ query }) => {
  const lexioDivinaId = query.lexioId as string;
  const db = new Mongodb();
  const [lexioDivina] = await db.aggregate<AggregatedLexioDivina[]>(
    CollectionName.LexioDivinas,
    [
      {
        $match: {
          _id: new ObjectId(lexioDivinaId),
        },
      },
      {
        $addFields: {
          createdAt: { $toDate: '$_id' },
        },
      },
      {
        $lookup: {
          from: CollectionName.Users,
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            // 민감한 정보 제거
            {
              $project: {
                kakaoId: 0,
                email: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: '$user',
      },
    ]
  );

  db.close();

  if (!lexioDivina) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      lexioDivina: JSON.parse(JSON.stringify(lexioDivina)),
    },
  };
};

const LexioDivinaDetail: NextPage<LexioDivinaDetailProps> = ({
  lexioDivina,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: me, logout } = useAuth();

  // liked와 comment는 업데이트를 위해 client side에서 fetching
  const {
    data: lexioDivinaData,
    isError,
    isLoading,
  } = useLexioDivina(lexioDivina._id);

  const likedUserIds = lexioDivinaData?.lexioDivina.likedUserIds ?? [];
  const comments = lexioDivinaData?.lexioDivina.comments ?? [];

  const [deleteDialog, setDeleteDialog] = useState<Dialog | null>(null);

  const [selectedLexioDivinaIdForDelete, setSelectedLexioDivinaIdForDelete] =
    useState<string | null>(null);

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
      router.push('/');
    } catch {
      //
    }
  };

  const addLike = async (id: string) => {
    if (!me) return;

    try {
      await postLikedToLexioDivina(id, {
        userId: me._id,
      });
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINA_QUERY_KEY] });
    } catch {
      //
    }
  };

  const deleteLike = async (id: string) => {
    if (!me) return;

    try {
      await deleteLikedInLexioDivina(id, me._id);
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
    if (!deleteDialog) return;
    try {
      await deleteCommentInLexioDivina(lexioDivina._id, deleteDialog.id);
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINA_QUERY_KEY] });
      setDeleteDialog(null);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      }
    }
  };

  const handleCommentButtonClick = () => {
    // TODO: 댓글 쓰기
  };

  const handleAuthorClick = (id: string) => {
    router.push(`/users/${id}`);
  };

  const handleLexioDivinaEdit = (id: string) => {
    router.push(`/lexio-divinas/${id}/edit`);
  };

  const handleCommentDelete = (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  return (
    <>
      <Meta />
      <GlobalHeader backButton />

      <Container maxWidth="sm" sx={{ py: 2 }}>
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
          isMine={lexioDivina.user._id === me?._id}
          isLiked={!!likedUserIds.find((id) => id === me?._id)}
          onEditMenuItemClick={() => handleLexioDivinaEdit(lexioDivina._id)}
          onDeleteMenuItemClick={() =>
            setSelectedLexioDivinaIdForDelete(lexioDivina._id)
          }
          likeButtonDisabled={!me}
          onIsLikedSubmit={(isLiked) =>
            isLiked ? addLike(lexioDivina._id) : deleteLike(lexioDivina._id)
          }
          likedCount={likedUserIds.length}
          commentCount={comments.length}
          onCommentButtonClick={handleCommentButtonClick}
          onUserClick={() => handleAuthorClick(lexioDivina.user._id)}
          createdAt={lexioDivina.createdAt}
        />

        <Stack gap={1} mt={2}>
          {isError ? (
            <ErrorMessage />
          ) : isLoading ? (
            <LoadingCircular />
          ) : (
            comments
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
              .reverse()
          )}
        </Stack>
      </Container>

      <AlertDialog
        open={!!selectedLexioDivinaIdForDelete}
        onClose={() => setSelectedLexioDivinaIdForDelete(null)}
        onSubmit={handleLexioDivinaDelete}
        title="삭제 확인"
        description="묵상글을 삭제하시겠습니까?"
        color="error"
      />

      <AlertDialog
        open={!!deleteDialog}
        title="삭제 확인"
        description="댓글을 삭제하시겠습니까?"
        onClose={() => setDeleteDialog(null)}
        onSubmit={deleteComment}
        color="error"
      />
    </>
  );
};

export default LexioDivinaDetail;
