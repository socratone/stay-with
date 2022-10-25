import { Container } from '@mui/system';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NavigationFooter from '../components/NavigationFooter';
import PostCard from '../components/PostCard';
import usePosts from '../hooks/api/usePosts';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/public');
  }, [router]);

  const { posts } = usePosts();

  const getPhrase = (
    text: string,
    book: string,
    startedChapter: number,
    startedVerse: number,
    endedChapter?: number,
    endedVerse?: number
  ) => {
    if (endedChapter && endedVerse) {
      if (startedChapter === endedChapter) {
        return `${text} (${book} ${startedChapter},${startedVerse}-${endedVerse})`;
      }

      return `${text} (${book} ${startedChapter},${startedVerse}-${endedChapter},${endedVerse})`;
    }

    return `${text} (${book} ${startedChapter},${startedVerse})`;
  };

  return (
    <>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container component="main" maxWidth="sm" sx={{ px: 0 }}>
        {posts?.map((item) => (
          <PostCard
            key={item.id}
            name={item.name}
            phrase={getPhrase(
              item.phrase,
              item.book,
              item.startedChapter,
              item.startedVerse,
              item?.endedChapter,
              item?.endedVerse
            )}
            content={item.content}
            isLiked={false}
          />
        ))}
      </Container>

      <NavigationFooter />
    </>
  );
};

export default Home;
