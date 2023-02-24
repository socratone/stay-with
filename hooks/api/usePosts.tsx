import { getPosts, GetPostsParams } from 'libs/axios/apis';
import { useQuery } from 'react-query';

const usePosts = (params?: GetPostsParams) => {
  return useQuery([params, '/api/posts'], () => getPosts(params), {
    keepPreviousData: true,
  });
};

export default usePosts;
