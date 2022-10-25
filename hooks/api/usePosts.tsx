import useSWR from 'swr';
import { getPosts } from '../../libs/firebase/apis';

const usePosts = () => {
  const { data, error } = useSWR('/posts', getPosts);

  return {
    posts: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default usePosts;
