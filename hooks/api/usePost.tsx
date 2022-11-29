import useSWR from 'swr';
import { getPost } from '../../libs/firebase/apis';

const usePost = (postId?: string) => {
  const { data, error, mutate } = useSWR(
    postId ? [postId, 'post'] : null,
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
