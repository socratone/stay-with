import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import LexioDivinas from 'feature/LexioDivinas';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <>
      <Meta />
      <GlobalHeader />
      <LexioDivinas />
    </>
  );
};

export default Home;
