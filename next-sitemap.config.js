/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://tactec.club',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  
  // Exclude paths that shouldn't be in sitemap
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
    '/404',
    '/500',
    '/_*',
    '/sitemap.xml',
    '/sitemap-*.xml',
    '/robots.txt',
    '/manifest.json',
    '/browserconfig.xml',
    '/*.json',
    '/*.xml',
    '/*.txt'
  ],

  // Default values for all URLs
  changefreq: 'weekly',
  priority: 0.8,
  autoLastmod: true,
  
  // Internationalization - All supported locales
  alternateRefs: [
    {
      href: 'https://tactec.club/',
      hreflang: 'en',
    },
    {
      href: 'https://tactec.club/ar/',
      hreflang: 'ar',
    },
    {
      href: 'https://tactec.club/pt/',
      hreflang: 'pt',
    },
    {
      href: 'https://tactec.club/pt-BR/',
      hreflang: 'pt-BR',
    },
    {
      href: 'https://tactec.club/es/',
      hreflang: 'es',
    },
    {
      href: 'https://tactec.club/fr/',
      hreflang: 'fr',
    },
    {
      href: 'https://tactec.club/it/',
      hreflang: 'it',
    },
    {
      href: 'https://tactec.club/de/',
      hreflang: 'de',
    },
    {
      href: 'https://tactec.club/',
      hreflang: 'x-default',
    }
  ],

  // Transform function to handle multilingual URLs
  transform: async (config, path) => {
    const locales = ['en', 'ar', 'pt', 'pt-BR', 'es', 'fr', 'it', 'de'];
    
    // Set priority based on page importance
    let priority = 0.8;
    let changefreq = 'weekly';
    
    if (path === '/') {
      priority = 1.0;
      changefreq = 'weekly';
    } else if (path === '/contact') {
      priority = 0.9;
      changefreq = 'monthly';
    } else if (path === '/privacy') {
      priority = 0.5;
      changefreq = 'monthly';
    }

    // Create alternate refs for this specific path
    const alternateRefs = locales.map(locale => ({
      href: `${config.siteUrl}${locale === 'en' ? path : `/${locale}${path}`}`,
      hreflang: locale,
    }));
    
    // Add x-default alternate ref
    alternateRefs.push({
      href: `${config.siteUrl}${path}`,
      hreflang: 'x-default',
    });

    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: alternateRefs,
    };
  },

  // Additional paths to include (static pages)
  additionalPaths: async (config) => {
    const staticPaths = [
      {
        path: '/contact',
        priority: 0.9,
        changefreq: 'monthly'
      },
      {
        path: '/privacy',
        priority: 0.5,
        changefreq: 'monthly'
      }
    ];

    const locales = ['en', 'ar', 'pt', 'pt-BR', 'es', 'fr', 'it', 'de'];
    const paths = [];

    // Generate paths for each locale
    staticPaths.forEach(({ path, priority, changefreq }) => {
      locales.forEach(locale => {
        const localePath = locale === 'en' ? path : `/${locale}${path}`;
        
        // Create alternate refs for this path
        const alternateRefs = locales.map(l => ({
          href: `${config.siteUrl}${l === 'en' ? path : `/${l}${path}`}`,
          hreflang: l,
        }));
        
        // Add x-default
        alternateRefs.push({
          href: `${config.siteUrl}${path}`,
          hreflang: 'x-default',
        });

        paths.push({
          loc: localePath,
          changefreq: changefreq,
          priority: priority,
          lastmod: new Date().toISOString(),
          alternateRefs: alternateRefs,
        });
      });
    });

    return paths;
  },

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/*.json$',
          '/*.xml$',
          '/*.txt$',
        ],
      },
      // Block AI training bots
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        disallow: '/',
      },
      {
        userAgent: 'YouBot',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      // Allow specific crawlers with crawl delays
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'Slurp',
        allow: '/',
        crawlDelay: 2,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        crawlDelay: 1,
      },
      // Allow social media crawlers
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        userAgent: 'LinkedInBot',
        allow: '/',
      },
      {
        userAgent: 'WhatsApp',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      // Add any additional sitemaps here if needed
      // 'https://tactec.club/server-sitemap.xml',
    ],
    transformRobotsTxt: async (_, robotsTxt) => {
      return robotsTxt + `
# Additional crawlers
User-agent: Applebot
Allow: /
Crawl-delay: 1

User-agent: YandexBot
Allow: /
Crawl-delay: 2

# Block unwanted bots
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

# Host directive (optional, helps with internationalization)
Host: https://tactec.club

# Crawl-delay for all other bots
User-agent: *
Crawl-delay: 1`;
    },
  },

  // Output directory (default is public)
  outDir: './public',
  
  // Additional configuration options
  trailingSlash: false,
  
  // Custom headers for sitemap files
  additionalSitemaps: [
    // You can add dynamic sitemaps here if needed
    // For example, if you have a blog or dynamic content
  ],
};
