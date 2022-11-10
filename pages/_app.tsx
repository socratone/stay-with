import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import ThemeProvider from '../theme/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import AuthProvider from '../contexts/AuthProvider';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <SessionProvider session={session}>
        <AuthProvider>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </AuthProvider>
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
