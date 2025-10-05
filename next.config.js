/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  clientsClaim: true, 
  disable: process.env.NODE_ENV === 'development',
  fallbacks: {
    document: '/offline', // offline fallback
  },
  // Precache all static pages + offline
  additionalManifestEntries: [
    { url: '/', revision: '1' },
    { url: '/about', revision: '1' },
    { url: '/skills', revision: '1' },
    { url: '/projects', revision: '1' },
    { url: '/certifications', revision: '1' },
    { url: '/contact', revision: '1' },
    { url: '/offline', revision: '1' },
    { url: '/chat', revision: '1' },
  ],
  runtimeCaching: [
    // Precache offline page
    {
      urlPattern: /^\/offline$/,
      handler: 'CacheFirst',
      options: { cacheName: 'offline-cache', expiration: { maxEntries: 1 } },
    },
    // Dynamic project pages: cache first visit
    {
      urlPattern: /^\/projects\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'projects-cache',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Dashboard (dynamic)
    {
      urlPattern: /^\/dashboard$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'dashboard-cache',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 10, maxAgeSeconds: 30 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Next.js data requests
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'next-data',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Next.js static files
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'next-static', expiration: { maxEntries: 100, maxAgeSeconds: 365 * 24 * 60 * 60 } },
    },
    // Navigation pages (HTML)
    {
      urlPattern: /^\/(?!.*\.(?:js|css|png|jpg|jpeg|svg|gif|webp|ico|json)).*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'navigation-cache',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    // Images
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|avif)$/i,
      handler: 'CacheFirst',
      options: { cacheName: 'image-cache', expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 } },
    },
    // JS & CSS
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-resources', expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 } },
    },
    // Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'google-fonts', expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 } },
    },
    // External scripts
    {
      urlPattern: /^https:\/\/(umami.*\.vercel\.app|vitals\.vercel-insights\.com|va\.vercel-scripts\.com)\/.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'external-scripts', networkTimeoutSeconds: 5, expiration: { maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 } },
    },
    // Fallback for other HTTP requests
    {
      urlPattern: /^https?.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'http-cache', networkTimeoutSeconds: 10, expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 }, cacheableResponse: { statuses: [0, 200] } },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Your existing pattern for your primary domain
      { protocol: 'https', hostname: 'christianluisaceron.com', pathname: '/**' },
      
      // The new pattern to allow the Supabase host
      { 
        protocol: 'https', 
        hostname: 'sofevtzqwdbudqaorxys.supabase.co', 
        // This pathname restricts image loading to only the 'projects-images' bucket
        pathname: '/storage/v1/object/sign/projects-images/**', 
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};


module.exports = withPWA(nextConfig);
