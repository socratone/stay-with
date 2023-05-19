import { Head, Html, Main, NextScript } from 'next/document';

const InitialBackgroundColorScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (() => {
            const savedColorMode = localStorage.getItem('colorMode');
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const colorMode = savedColorMode ?? prefersDarkMode;
            const backgroundColor = colorMode === 'dark' ? '#000' : '#fff';
            const root = document.documentElement;
            root.style.setProperty('--background-color', backgroundColor);
          })()`,
      }}
    />
  );
};

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* pretendard font */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.5/dist/web/static/pretendard.css"
        />
      </Head>
      <body>
        <InitialBackgroundColorScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
