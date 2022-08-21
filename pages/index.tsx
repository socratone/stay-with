import type { NextPage } from 'next';
import Head from 'next/head';
import PostCard from '../components/PostCard';

type Book = '창세';

type Item = {
  id: string;
  name: string;
  isLiked: boolean;
  text: string;
  book: Book;
  startedChapter: number;
  startedVerse: number;
  endedChapter?: number;
  endedVerse?: number;
  content: string;
};

const items: Item[] = [
  {
    id: '1',
    name: '사오정',
    book: '창세',
    isLiked: true,
    startedChapter: 1,
    startedVerse: 1,
    text: '한처음에 하느님께서 하늘과 땅을 창조하셨다.',
    content: '하나 두울\n셋 넷',
  },
  {
    id: '2',
    book: '창세',
    name: '저팔계',
    isLiked: false,
    startedChapter: 1,
    startedVerse: 2,
    endedChapter: 1,
    endedVerse: 3,
    text: '땅은 아직 꼴을 갖추지 못하고 비어 있었는데, 어둠이 심연을 덮고 하느님의 영이 그 물 위를 감돌고 있었다. 하느님께서 말씀하시기를 “빛이 생겨라.” 하시자 빛이 생겼다.',
    content: '내 나이프 내놓으셔!',
  },
];

const Home: NextPage = () => {
  const getPhrase = (
    text: string,
    book: Book,
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
    <div>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {items.map((item) => (
          <PostCard
            key={item.id}
            name={item.name}
            phrase={getPhrase(
              item.text,
              item.book,
              item.startedChapter,
              item.startedVerse,
              item?.endedChapter,
              item?.endedVerse
            )}
            content={item.content}
            isLiked={item.isLiked}
          />
        ))}
      </main>
    </div>
  );
};

export default Home;
