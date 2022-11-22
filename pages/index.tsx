import { Container } from '@mui/system';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AlertDialog from '../components/AlertDialog';
import GlobalHeader from '../components/GlobalHeader';
import PostCard from '../components/PostCard';
import {
  addLikeToPost,
  deleteLikeInPost,
  deletePost,
} from '../libs/firebase/apis';
import { Box, CircularProgress } from '@mui/material';
import usePostsInfinite from '../hooks/api/usePostsInfinite';
import InfiniteScroll from 'react-infinite-scroll-component';
import useAuthenticated from '../hooks/context/useAuthenticated';
import { Post } from '../libs/firebase/interfaces';
import CommentDrawer from '../components/CommentDrawer';

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = useAuthenticated();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [commentButtonClickedPost, setCommentButtonClickedPost] =
    useState<Post | null>(null);

  const { posts, size, setSize, isEnded, mutate } = usePostsInfinite();

  const handleEdit = (id: string) => {
    router.push({
      pathname: '/contemplation',
      query: { id },
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePost(deleteId);
      mutate();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteId(null);
    }
  };

  const handleLike = async (id: string) => {
    if (!user) return;

    try {
      await addLikeToPost(id, {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image ?? undefined,
      });
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlike = async (id: string) => {
    if (!user) return;

    try {
      await deleteLikeInPost(id, {
        id: user.id,
      });
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentButtonClick = (post: Post) => {
    setCommentButtonClickedPost(post);
  };

  const handleCommentDrawerClose = () => {
    setCommentButtonClickedPost(null);
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
          {posts?.map((post) => (
            <Box key={post.id} pt={1} pb={1} px={2}>
              <PostCard
                name={post.user.name}
                profileImageUrl={post.user.image}
                phrase={post.phrase}
                bible={post.bible}
                startedChapter={post.startedChapter}
                startedVerse={post.startedVerse}
                endedChapter={post.endedChapter}
                endedVerse={post.endedVerse}
                content={post.content}
                isMine={post.user.email === user?.email}
                // TODO
                isLiked={!!post.likedUsers[user?.id ?? '']}
                onEdit={() => handleEdit(post.id)}
                onDelete={() => setDeleteId(post.id)}
                onLike={() => handleLike(post.id)}
                onUnlike={() => handleUnlike(post.id)}
                likedCount={Object.keys(post.likedUsers ?? {}).length}
                onCommentButtonClick={() => handleCommentButtonClick(post)}
              />
            </Box>
          ))}
        </InfiniteScroll>
      </Container>

      <CommentDrawer
        open={!!commentButtonClickedPost}
        onClose={handleCommentDrawerClose}
        comments={[
          // TODO: api 연결
          {
            id: 'asdfsdf',
            user: {
              email: 'asdf@asdf.com',
              id: 'sadfsad',
              name: '김말똥',
            },
            message: 'awesome',
          },
          {
            id: 'asdfsdff',
            user: {
              email: 'asdf@asdf.com',
              id: 'sadfsad',
              name: '이말똥',
            },
            message: 'awesome',
          },
          {
            id: 'xsdfsdff',
            user: {
              email: 'asdf@asdf.com',
              id: 'sadfsad',
              name: '나말똥',
            },
            message: 'awesome',
          },
        ]}
      />

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
