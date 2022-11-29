import {
  getPostsInfinite,
  GetPostsInfiniteOptions,
} from '../../libs/firebase/apis';
import useSWRInfinite from 'swr/infinite';
import { Post } from '../../libs/firebase/interfaces';
import { useEffect, useState } from 'react';

const usePostsInfinite = (options?: GetPostsInfiniteOptions) => {
  const [isEnded, setIsEnded] = useState(false);

  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null; // 끝에 도달
    const endPost = previousPageData?.[previousPageData.length - 1];
    return [endPost?.createdAt, options, 'posts']; // 키
  };

  const { data, error, size, setSize, mutate } = useSWRInfinite(
    getKey,
    getPostsInfinite
  );

  useEffect(() => {
    if (data?.[data.length - 1].length === 0) {
      setIsEnded(true);
    } else {
      setIsEnded(false);
    }
  }, [data]);

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
    isEnded,
    mutate,
  };
};

export default usePostsInfinite;
