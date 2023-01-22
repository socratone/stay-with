import '../styles/globals.css';
import type { AppProps } from 'next/app';
import ThemeProvider from '../contexts/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/lib/persistStore';
import { SnackbarProvider } from 'notistack';
import Snackbar from 'components/Snackbar';

const persistor = persistStore(store);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={8000}
            disableWindowBlurListener
            Components={{
              // default is success
              default: Snackbar,
              success: Snackbar,
              error: Snackbar,
              info: Snackbar,
              warning: Snackbar,
            }}
          >
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
