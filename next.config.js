/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // i18n configuration
  i18n: {
    locales: ['en', 'ar', 'pt', 'pt-BR', 'es', 'fr', 'it', 'de'],
    defaultLocale: 'en',
    localeDetection: false,
  },

  // Image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },

  // Redirects (optional - add if needed)
  async redirects() {
    return [
      // Example: redirect old paths
      // {
      //   source: '/old-path',
      //   destination: '/',
      //   permanent: true,
      // },
    ];
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Webpack customization (optional)
  webpack: (config, { isServer }) => {
    // Bundle analyzer (uncomment if needed)
    // if (process.env.ANALYZE === 'true') {
    //   const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    //   config.plugins.push(
    //     new BundleAnalyzerPlugin({
    //       analyzerMode: 'static',
    //       openAnalyzer: false,
    //     })
    //   );
    // }

    return config;
  },
};

module.exports = nextConfig;
