import GlobalHeader from 'components/GlobalHeader';
import type { NextPage } from 'next';
import Head from 'next/head';
import Posts from 'sections/Posts';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalHeader />

      <Posts />
    </>
  );
};

export default Home;
