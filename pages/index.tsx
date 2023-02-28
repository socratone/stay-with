import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import type { NextPage } from 'next';
import LexioDivinas from 'sections/LexioDivinas';

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
