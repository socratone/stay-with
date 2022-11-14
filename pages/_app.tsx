import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import ThemeProvider from '../contexts/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import AuthProvider from '../contexts/AuthProvider';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/lib/persistStore';

const persistor = persistStore(store);

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider session={session}>
          <AuthProvider>
            <ThemeProvider>
              <Component {...pageProps} />
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
