import { GetPostsParams, getPosts } from 'libs/axios/apis';
import { useQuery } from 'react-query';

const usePosts = (params?: GetPostsParams) => {
  return useQuery([params, '/api/posts'], () => getPosts(params));
};

export default usePosts;
