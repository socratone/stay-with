import { Container } from '@mui/system';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NavigationFooter from '../components/NavigationFooter';
import PostCard from '../components/PostCard';
import usePosts from '../hooks/api/usePosts';
import { bibleLabel } from '../libs/firebase/constants';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/public');
  }, [router]);

  const { posts } = usePosts();

  const getPhrase = (
    phrase: string,
    bible: string,
    startedChapter: number,
    startedVerse: number,
    endedChapter?: number,
    endedVerse?: number
  ) => {
    if (endedChapter && endedVerse) {
      if (startedChapter === endedChapter) {
        return `${phrase} (${bible} ${startedChapter},${startedVerse}-${endedVerse})`;
      }

      return `${phrase} (${bible} ${startedChapter},${startedVerse}-${endedChapter},${endedVerse})`;
    }

    return `${phrase} (${bible} ${startedChapter},${startedVerse})`;
  };

  const handleEdit = (id: string) => {
    router.push({
      pathname: '/form',
      query: { id },
    });
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
              bibleLabel[item.bible],
              item.startedChapter,
              item.startedVerse,
              item?.endedChapter,
              item?.endedVerse
            )}
            content={item.content}
            isLiked={false}
            onEdit={() => handleEdit(item.id)}
          />
        ))}
      </Container>

      <NavigationFooter />
    </>
  );
};

export default Home;
