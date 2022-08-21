import '../styles/globals.css';
// swiper
import 'swiper/swiper.scss';

import type { AppProps } from 'next/app';
import ThemeProvider from '../contexts/ThemeProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
