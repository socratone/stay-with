import { getPostsInfinite } from '../../libs/firebase/apis';
import useSWRInfinite from 'swr/infinite';
import { Post } from '../../libs/firebase/interfaces';

const getKey = (pageIndex: number, previousPageData: Post[]) => {
  if (previousPageData && !previousPageData.length) return null; // 끝에 도달
  const endPost = previousPageData?.[previousPageData.length - 1];
  return [endPost?.createdAt, 'posts']; // 키
};

const usePostsInfinite = () => {
  const { data, error, size, setSize } = useSWRInfinite(
    getKey,
    getPostsInfinite
  );

  const getPosts = () => {
    if (!data) return [];
    return data.reduce((previous, current) => {
      return previous.concat(current);
    }, []);
  };

  return {
    posts: getPosts(),
    size,
    setSize,
    isLoading: !error && !data,
    isError: error,
  };
};

export default usePostsInfinite;
