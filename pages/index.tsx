import { Container } from '@mui/system';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import AlertDialog from '../components/AlertDialog';
import GlobalHeader from '../components/GlobalHeader';
import PostCard from '../components/PostCard';
import usePosts from '../hooks/api/usePosts';
import { deletePost } from '../libs/firebase/apis';
import { bibleLabel } from '../libs/firebase/constants';

const Home: NextPage = () => {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePost(deleteId);
      mutate('/posts');
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalHeader />

      <Container component="main" maxWidth="sm" sx={{ px: 0 }}>
        {posts?.map((item) => (
          <PostCard
            key={item.id}
            nickname={item.user.nickname}
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
            onDelete={() => setDeleteId(item.id)}
          />
        ))}
      </Container>

      <AlertDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onSubmit={handleDelete}
        title="삭제 확인"
        description="정말로 삭제하시겠습니까?"
      />
    </>
  );
};

export default Home;
