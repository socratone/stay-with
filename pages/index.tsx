import { Container } from '@mui/system';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import AlertDialog from '../components/AlertDialog';
import GlobalHeader from '../components/GlobalHeader';
import PostCard from '../components/PostCard';
import { deletePost } from '../libs/firebase/apis';
import { bibleLabel } from '../libs/firebase/constants';
import { User } from '../libs/firebase/interfaces';
import { Box, Button, CircularProgress } from '@mui/material';
import usePostsInfinite from '../hooks/api/usePostsInfinite';
import InfiniteScroll from 'react-infinite-scroll-component';

const Home: NextPage = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // TODO: token으로 바꿔야 함
  useEffect(() => {
    const stringifyUser = localStorage.getItem('user');
    if (stringifyUser) {
      const user = JSON.parse(stringifyUser);
      setUser(user);
    }
  }, []);

  const { posts, size, setSize, isEnded } = usePostsInfinite();

  const getPhrase = (
    phrase: string,
    bible: string,
    startedChapter: number,
    startedVerse: number,
    endedChapter?: number,
    endedVerse?: number
  ) => {
    if (endedChapter && endedVerse) {
      if (startedChapter === endedChapter) {
        return `${phrase} (${bible} ${startedChapter},${startedVerse}-${endedVerse})`;
      }

      return `${phrase} (${bible} ${startedChapter},${startedVerse}-${endedChapter},${endedVerse})`;
    }

    return `${phrase} (${bible} ${startedChapter},${startedVerse})`;
  };

  const handleEdit = (id: string) => {
    router.push({
      pathname: '/form',
      query: { id },
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePost(deleteId);
      mutate('/posts');
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalHeader />

      <Container component="main" maxWidth="sm" sx={{ px: 0, pb: 2 }}>
        <InfiniteScroll
          dataLength={posts.length}
          next={() => setSize(size + 1)}
          hasMore={!isEnded}
          loader={
            <Box pt={3} pb={3} textAlign="center">
              <CircularProgress />
            </Box>
          }
        >
          {posts?.map((item) => (
            <PostCard
              key={item.id}
              nickname={item.user.nickname}
              phrase={getPhrase(
                item.phrase,
                bibleLabel[item.bible],
                item.startedChapter,
                item.startedVerse,
                item?.endedChapter,
                item?.endedVerse
              )}
              content={item.content}
              isMine={item.user.id === user?.id}
              isLiked={false}
              onEdit={() => handleEdit(item.id)}
              onDelete={() => setDeleteId(item.id)}
            />
          ))}
        </InfiniteScroll>
      </Container>

      <AlertDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onSubmit={handleDelete}
        title="삭제 확인"
        description="정말로 삭제하시겠습니까?"
      />
    </>
  );
};

export default Home;
