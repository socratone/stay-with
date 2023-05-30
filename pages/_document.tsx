import { Head, Html, Main, NextScript } from 'next/document';

/**
 * body의 제일 앞에 와서 다른 element보다 먼저 실행되고
 * 주요 color를 위한 initial css value를 미리 설정하여
 * useEffect에서 결정되는 colorMode로 인한 깜빡이는 현상을 방지한다.
 */
const InitialBackgroundColorScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof window !== 'undefined') {
            const savedColorMode = localStorage.getItem('colorMode');
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const colorMode = savedColorMode ?? prefersDarkMode;
            const backgroundColor = colorMode === 'dark' ? '#000' : '#fff';
            const root = document.documentElement;
            root.style.setProperty('--background-color', backgroundColor);
          }
        `,
      }}
    />
  );
};

/**
 * A custom Document can update the <html> and <body> tags used to render a Page.
 * This file is only rendered on the server, so event handlers like onClick cannot be used in _document
 */
export default function Document() {
  return (
    <Html>
      <Head>
        <meta
          name="theme-color"
          content="#000"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
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
