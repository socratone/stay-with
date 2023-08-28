import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

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

const InitialFontSizeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof window !== 'undefined') {
            const savedFontSize = localStorage.getItem('fontSize');
            if (savedFontSize) {
              const root = document.documentElement;
              root.style.setProperty('--font-size', savedFontSize);
            }
          }
        `,
      }}
    />
  );
};

const GoogleTagManager = () => {
  const gtmContainerId = process.env.GTM_CONTAINER_ID;

  if (!gtmContainerId) {
    return null;
  }

  return (
    <Script id="google-tag-manager">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmContainerId}'); 
      `}
    </Script>
  );
};

const GoogleTagManagerNoScript = () => {
  const gtmContainerId = process.env.GTM_CONTAINER_ID;

  if (!gtmContainerId) {
    return null;
  }

  return (
    <Script id="google-tag-manager-no-script">
      {`
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
      `}
    </Script>
  );
};

/**
 * A custom Document can update the <html> and <body> tags used to render a Page.
 * This file is only rendered on the server, so event handlers like onClick cannot be used in _document
 */
export default function Document() {
  const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

  return (
    <Html>
      <Head>
        {isProduction ? <GoogleTagManager /> : null}
        {/* pwa를 위해서 다크 모드일 때 theme-color를 '#000'으로 변경 */}
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
        {isProduction ? <GoogleTagManagerNoScript /> : null}
        <InitialBackgroundColorScript />
        <InitialFontSizeScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
