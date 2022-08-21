import { NextPage } from 'next';
import Head from 'next/head';
import NavigationFooter from '../components/NavigationFooter';

const Public: NextPage = () => {
  return (
    <div>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>hello public</main>

      <NavigationFooter />
    </div>
  );
};

export default Public;
