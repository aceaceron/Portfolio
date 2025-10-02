/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Add fallback for offline support
  fallbacks: {
    document: '/offline', // Shows offline page when network request fails
  },
  runtimeCaching: [
    // Cache the homepage specifically
    {
      urlPattern: /^\/$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache Next.js data requests (_next/data/) - CRITICAL for Next.js routing
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'next-data',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache Next.js static files - CRITICAL for Next.js
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    // Cache HTML/navigation routes (other pages)
    {
      urlPattern: /^\/(?!.*\.(?:js|css|png|jpg|jpeg|svg|gif|webp|ico|json)).*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'navigation-cache',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache images
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|avif)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    // Cache JS and CSS
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    // Cache Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    // Cache external scripts (Umami, Vercel Analytics)
    {
      urlPattern: /^https:\/\/(umami.*\.vercel\.app|vitals\.vercel-insights\.com|va\.vercel-scripts\.com)\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'external-scripts',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
    // Cache other HTTPS requests (fallback)
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'http-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'christianluisaceron.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = withPWA(nextConfig);