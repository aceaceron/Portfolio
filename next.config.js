/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [], // optional, only needed if you fetch external images
    formats: ['image/avif', 'image/webp'], // serve modern formats
  },
};

module.exports = nextConfig;
