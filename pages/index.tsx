import { Container } from '@mui/system';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AlertDialog from '../components/AlertDialog';
import GlobalHeader from '../components/GlobalHeader';
import PostCard from '../components/PostCard';
import {
  addCommentToPost,
  addLikeToPost,
  deleteCommentInPost,
  deleteLikeInPost,
  deletePost,
} from '../libs/firebase/apis';
import { Box, CircularProgress } from '@mui/material';
import usePostsInfinite from '../hooks/api/usePostsInfinite';
import InfiniteScroll from 'react-infinite-scroll-component';
import useAuthenticated from '../hooks/context/useAuthenticated';
import { Comment, Post } from '../libs/firebase/interfaces';
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

  const handleMessageSend = async (message: string) => {
    if (!commentButtonClickedPost || !user) return;
    try {
      const now = new Date().getTime();
      await addCommentToPost(commentButtonClickedPost.id, {
        user,
        message,
        createdAt: now,
      });
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMessageDelete = async (comment: Comment) => {
    if (!commentButtonClickedPost || !user) return;
    try {
      await deleteCommentInPost(commentButtonClickedPost.id, comment);
      mutate();
    } catch (error) {
      console.error(error);
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
          {posts?.map((post) => (
            <Box key={post.id} pt={1} pb={1} px={2}>
              <PostCard
                name={post.user.name}
                profileImage={post.user.image}
                phrase={post.phrase}
                bible={post.bible}
                startedChapter={post.startedChapter}
                startedVerse={post.startedVerse}
                endedChapter={post.endedChapter}
                endedVerse={post.endedVerse}
                content={post.content}
                isMine={post.user.email === user?.email}
                isLiked={!!post.likedUsers[user?.id ?? '']}
                onEditMenuItemClick={() => handleEdit(post.id)}
                onDeleteMenuItemClick={() => setDeleteId(post.id)}
                // TODO: 계속 클릭해도 한 번만 요청하도록
                onLikeButtonClick={() => handleLike(post.id)}
                onUnlikeButtonClick={() => handleUnlike(post.id)}
                likedCount={Object.keys(post.likedUsers ?? {}).length}
                onCommentButtonClick={() => handleCommentButtonClick(post)}
              />
            </Box>
          ))}
        </InfiniteScroll>
      </Container>

      <CommentDrawer
        open={!!commentButtonClickedPost}
        comments={commentButtonClickedPost?.comments ?? []}
        onClose={handleCommentDrawerClose}
        onMessageSend={handleMessageSend}
        onMessgeDelete={handleMessageDelete}
        user={user}
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
