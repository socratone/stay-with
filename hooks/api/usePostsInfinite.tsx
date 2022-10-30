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
    let results: Post[] = [];
    if (!data) return [];
    data.forEach((posts) => {
      results = results.concat(posts);
    });
    return results;
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
