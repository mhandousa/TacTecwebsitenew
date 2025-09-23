/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Internationalization configuration
  i18n: {
    locales: ['en', 'ar', 'pt', 'pt-BR', 'es', 'fr', 'it', 'de'],
    defaultLocale: 'en',
    // Note: localeDetection is false by default in Next.js 14
  },

  // Image optimization configuration
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },

  // Redirects configuration
  async redirects() {
    return [
      // Add any permanent redirects here
      // Example:
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // Rewrites configuration (for API proxying if needed)
  async rewrites() {
    return [
      // Add any rewrites here
      // Example:
      // {
      //   source: '/api/:path*',
      //   destination: 'https://api.example.com/:path*',
      // },
    ];
  },

  // Compiler options
  compiler: {
    // Remove console logs in production (except errors and warnings)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Replace React with Preact in production (optional - removes ~30KB)
      // Uncomment if you want to use Preact
      // Object.assign(config.resolve.alias, {
      //   react: 'preact/compat',
      //   'react-dom': 'preact/compat',
      // });

      // Optimize bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for node_modules
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }

    // Bundle analyzer (uncomment to analyze bundle size)
    // if (process.env.ANALYZE === 'true') {
    //   const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    //   config.plugins.push(
    //     new BundleAnalyzerPlugin({
    //       analyzerMode: 'static',
    //       reportFilename: isServer
    //         ? '../analyze/server.html'
    //         : './analyze/client.html',
    //       openAnalyzer: false,
    //     })
    //   );
    // }

    return config;
  },

  // Environment variables that should be available in the browser
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://tactec.club',
  },

  // Output configuration
  output: 'standalone', // For optimal Docker/container deployments
  
  // Power profiling (useful for performance optimization)
  // Uncomment to enable
  // experimental: {
  //   profiling: true,
  // },

  // Enable SWC minification (faster builds)
  swcMinify: true,

  // Trailing slash configuration (disabled by default)
  trailingSlash: false,

  // ESLint configuration during builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },

  // TypeScript configuration during builds
  typescript: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },

  // Production browser target
  productionBrowserSourceMaps: false, // Set to true if you want source maps in production

  // Compress pages
  compress: true,

  // Generate etags for pages
  generateEtags: true,

  // Page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Powered by header (removes "X-Powered-By: Next.js")
  poweredByHeader: false,
};

module.exports = nextConfig;
