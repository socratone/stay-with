/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },
  async redirects() {
    return [
      {
        source: '/settings',
        destination: '/settings/profile',
        permanent: true,
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,

  org: 'socratone',
  project: 'javascript-nextjs',
};

const sentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
};

// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#extend-your-nextjs-configuration
module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  sentryOptions
);
