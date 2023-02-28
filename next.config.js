/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },
};

module.exports = nextConfig;
