import { Container } from '@mui/system';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import AlertDialog from '../components/AlertDialog';
import GlobalHeader from '../components/GlobalHeader';
import PostCard from '../components/PostCard';
import { deletePost } from '../libs/firebase/apis';
import { Box, CircularProgress } from '@mui/material';
import usePostsInfinite from '../hooks/api/usePostsInfinite';
import InfiniteScroll from 'react-infinite-scroll-component';
import GlobalFooter from '../components/GlobalFooter';
import useScrollDirection from '../hooks/dom/useScrollDirection';
import { useSession } from 'next-auth/react';

const Home: NextPage = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data: session } = useSession();
  const user = session?.user;

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { posts, size, setSize, isEnded } = usePostsInfinite();

  const { scrollDirection } = useScrollDirection();

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

      <Container
        component="main"
        maxWidth="sm"
        sx={{ px: { xs: 0, sm: 0, md: 0 }, pt: 1 }}
      >
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
            <Box key={item.id} pt={1} pb={1} px={2}>
              <PostCard
                name={item.user.name}
                profileImageUrl={item.user.image}
                phrase={item.phrase}
                bible={item.bible}
                startedChapter={item.startedChapter}
                startedVerse={item.startedVerse}
                endedChapter={item.endedChapter}
                endedVerse={item.endedVerse}
                content={item.content}
                isMine={item.user.email === user?.email}
                // TODO
                isLiked={false}
                onEdit={() => handleEdit(item.id)}
                onDelete={() => setDeleteId(item.id)}
              />
            </Box>
          ))}
        </InfiniteScroll>
      </Container>

      <GlobalFooter hidden={scrollDirection === 'down'} />

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
