/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['christianluisaceron.com'],
    formats: ['image/avif', 'image/webp'], // serve modern formats
  },
};

module.exports = nextConfig;
