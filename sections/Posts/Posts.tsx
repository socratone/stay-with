import { Masonry } from '@mui/lab';
import { Box, Container, Pagination } from '@mui/material';
import AlertDialog from 'components/AlertDialog';
import LoadingCircular from 'components/LoadingCircular';
import ErrorMessage from 'components/ErrorMessage';
import PostCard from 'components/PostCard';
import usePosts from 'hooks/api/usePosts';
import useAuth from 'hooks/context/useAuth';
import {
  deleteLikedInPost,
  deletePost,
  postLikedToPost,
} from 'libs/axios/apis';
import { GetPostsInfiniteOptions } from 'libs/firebase/apis';
import { Post } from 'libs/firebase/interfaces';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import CommentDrawer from 'sections/CommentDrawer';

interface PostsProps {
  fetchOptions?: GetPostsInfiniteOptions;
}

const PAGE_COUNT = 10;

const Posts: React.FC<PostsProps> = ({ fetchOptions }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const [selectedPostIdForDelete, setSelectedPostIdForDelete] = useState<
    string | null
  >(null);
  const [selectedPostForComment, setSelectedPostForComment] =
    useState<Post | null>(null);

  const postsParams = {
    offset: page,
    count: PAGE_COUNT,
  };

  const postsKey = [postsParams, '/api/posts'];

  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
  } = usePosts(postsParams);

  const posts = postsData?.posts ?? [];

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
      queryClient.invalidateQueries(postsKey);
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedPostIdForDelete(null);
    }
  };

  const handleLike = async (id: string) => {
    if (!user) return;

    try {
      await postLikedToPost(id, {
        userId: user._id,
      });
      queryClient.invalidateQueries(postsKey);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      } else {
        enqueueSnackbar('에러가 발생했습니다.', {
          variant: 'error',
        });
      }
    }
  };

  const handleUnlike = async (id: string) => {
    if (!user) return;

    try {
      await deleteLikedInPost(id, user._id);
      queryClient.invalidateQueries(postsKey);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      } else {
        enqueueSnackbar('에러가 발생했습니다.', {
          variant: 'error',
        });
      }
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

  if (postsLoading) {
    return <LoadingCircular />;
  }

  if (postsError) {
    return <ErrorMessage />;
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
          {posts.map((post) => (
            <PostCard
              key={post._id}
              name={post.user.name}
              profileImage={post.user.image}
              phrase={post.phrase}
              bible={post.bible}
              startedChapter={post.startedChapter}
              startedVerse={post.startedVerse}
              endedChapter={post.endedChapter}
              endedVerse={post.endedVerse}
              content={post.content}
              isMine={post.user._id === user?._id}
              isLiked={!!post.likedUserIds.find((id) => id === user?._id)}
              onEditMenuItemClick={() => handleEdit(post._id)}
              onDeleteMenuItemClick={() => setSelectedPostIdForDelete(post._id)}
              // TODO: 계속 클릭해도 한 번만 요청하도록
              onLikeButtonClick={() => handleLike(post._id)}
              onUnlikeButtonClick={() => handleUnlike(post._id)}
              likedCount={post.likedUserIds.length}
              onCommentButtonClick={() => handleCommentButtonClick(post)}
              onUserClick={() => handleUserClick(post.user._id)}
            />
          ))}
        </Masonry>

        <Box display="flex" justifyContent="center">
          {postsData?.total === 0 ? null : (
            <Pagination
              page={page}
              onChange={(_, page) => setPage(page)}
              count={Math.ceil(Number(postsData?.total) / PAGE_COUNT)}
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
        {posts?.map((post) => (
          <Box key={post._id} pt={1} pb={1} px={2}>
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
              isLiked={!!post.likedUserIds.find((id) => id === user?._id)}
              onEditMenuItemClick={() => handleEdit(post._id)}
              onDeleteMenuItemClick={() => setSelectedPostIdForDelete(post._id)}
              // TODO: 계속 클릭해도 한 번만 요청하도록
              onLikeButtonClick={() => handleLike(post._id)}
              onUnlikeButtonClick={() => handleUnlike(post._id)}
              likedCount={post.likedUserIds.length}
              onCommentButtonClick={() => handleCommentButtonClick(post)}
              onUserClick={() => handleUserClick(post.user._id)}
            />
          </Box>
        ))}

        <Box display="flex" justifyContent="center">
          {postsData?.total === 0 ? null : (
            <Pagination
              page={page}
              onChange={(_, page) => setPage(page)}
              count={Math.ceil(Number(postsData?.total) / PAGE_COUNT)}
            />
          )}
        </Box>
      </Container>

      <CommentDrawer
        open={!!selectedPostForComment}
        postId={selectedPostForComment?._id}
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
