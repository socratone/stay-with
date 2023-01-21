import { getPost } from 'libs/axios/apis';
import useSWR from 'swr';

const usePost = (postId?: string) => {
  const { data, error, mutate } = useSWR(
    postId ? [postId, '/api/posts'] : null,
    getPost
  );

  return {
    post: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export default usePost;
