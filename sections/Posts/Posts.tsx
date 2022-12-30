import { Masonry } from '@mui/lab';
import { Box, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import AlertDialog from '../../components/AlertDialog';
import LoadingCircular from '../../components/LoadingCircular';
import PostCard from '../../components/PostCard';
import usePostsInfinite from '../../hooks/api/usePostsInfinite';
import useAuth from '../../hooks/context/useAuth';
import {
  addLikeToPost,
  deleteLikeInPost,
  deletePost,
  GetPostsInfiniteOptions,
} from '../../libs/firebase/apis';
import { Post } from '../../libs/firebase/interfaces';
import CommentDrawer from '../CommentDrawer';

interface PostsProps {
  fetchOptions?: GetPostsInfiniteOptions;
}

const Posts: React.FC<PostsProps> = ({ fetchOptions }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedPostIdForDelete, setSelectedPostIdForDelete] = useState<
    string | null
  >(null);
  const [selectedPostForComment, setSelectedPostForComment] =
    useState<Post | null>(null);

  const { posts, size, setSize, isEnded, mutate } =
    usePostsInfinite(fetchOptions);

  const handleEdit = (id: string) => {
    router.push({
      pathname: '/contemplation',
      query: { id },
    });
  };

  const handlePostDelete = async () => {
    if (!selectedPostIdForDelete) return;

    try {
      await deletePost(selectedPostIdForDelete);
      mutate();
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedPostIdForDelete(null);
    }
  };

  const handleLike = async (id: string) => {
    if (!user) return;

    try {
      await addLikeToPost(id, {
        id: user.id,
        googleId: user.googleId,
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
    setSelectedPostForComment(post);
  };

  const handleCommentDrawerClose = () => {
    setSelectedPostForComment(null);
  };

  const handleUserClick = (id: string) => {
    router.push(`/user/${id}`);
  };

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
          {posts?.map((post) => (
            <PostCard
              key={post.id}
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
              onDeleteMenuItemClick={() => setSelectedPostIdForDelete(post.id)}
              // TODO: 계속 클릭해도 한 번만 요청하도록
              onLikeButtonClick={() => handleLike(post.id)}
              onUnlikeButtonClick={() => handleUnlike(post.id)}
              likedCount={Object.keys(post.likedUsers ?? {}).length}
              onCommentButtonClick={() => handleCommentButtonClick(post)}
              onUserClick={() => handleUserClick(post.user.id)}
            />
          ))}
        </Masonry>
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
        <InfiniteScroll
          dataLength={posts.length}
          next={() => setSize(size + 1)}
          hasMore={!isEnded}
          loader={<LoadingCircular />}
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
                onDeleteMenuItemClick={() =>
                  setSelectedPostIdForDelete(post.id)
                }
                // TODO: 계속 클릭해도 한 번만 요청하도록
                onLikeButtonClick={() => handleLike(post.id)}
                onUnlikeButtonClick={() => handleUnlike(post.id)}
                likedCount={Object.keys(post.likedUsers ?? {}).length}
                onCommentButtonClick={() => handleCommentButtonClick(post)}
                onUserClick={() => handleUserClick(post.user.id)}
              />
            </Box>
          ))}
        </InfiniteScroll>
      </Container>

      <CommentDrawer
        open={!!selectedPostForComment}
        postId={selectedPostForComment?.id}
        onClose={handleCommentDrawerClose}
      />

      <AlertDialog
        open={!!selectedPostIdForDelete}
        onClose={() => setSelectedPostIdForDelete(null)}
        onSubmit={handlePostDelete}
        title="삭제 확인"
        description="포스트를 삭제하시겠습니까?"
      />
    </>
  );
};

export default Posts;
