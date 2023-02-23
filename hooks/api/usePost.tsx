import { getPost } from 'libs/axios/apis';
import { useQuery } from 'react-query';

const usePost = (postId?: string) => {
  return useQuery([postId, '/api/posts'], () => getPost(postId as string), {
    enabled: !!postId,
  });
};

export default usePost;
