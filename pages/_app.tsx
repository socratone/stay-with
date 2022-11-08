import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';

import type { AppProps } from 'next/app';
import ThemeProvider from '../theme/ThemeProvider';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
