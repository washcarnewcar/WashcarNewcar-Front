/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['wcnc.s3.ap-northeast-2.amazonaws.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
