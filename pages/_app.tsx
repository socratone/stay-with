import 'styles/globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from 'components/Layout';
import Snackbar from 'components/Snackbar';
import VideoPlayer from 'components/VideoPlayer';
import English from 'content/locales/en.json';
import Korean from 'content/locales/ko.json';
import ThemeProvider from 'contexts/ThemeProvider';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { store } from 'redux/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // The query will refetch on window focus if the data is stale.
      refetchOnWindowFocus: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();

  const messages = useMemo(() => {
    if (locale === 'ko') return Korean;
    return English;
  }, [locale]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
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
            <IntlProvider locale={locale ?? 'ko'} messages={messages}>
              <VideoPlayer />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </IntlProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
