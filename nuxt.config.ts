// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ["assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      script: [
        {
          src: 'https://cloud.umami.is/script.js',
          'data-website-id': '6313bd15-0072-466d-a1b6-bfcbb6664898',
          defer: true
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Lunatrack',
            description: 'Your complete lunar guide with real-time moon data and celestial events',
            url: 'https://lunatrack.info',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://lunatrack.info/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }
      ]
    }
  },
  build: {
    transpile: [
      "@headlessui/vue",
      "@heroicons/vue",
    ]
  },
  modules: ["@pinia/nuxt", "@nuxtjs/apollo", "@nuxtjs/seo", "@nuxtjs/sitemap", "@nuxtjs/robots"],
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'https://eu-west-2.cdn.hygraph.com/content/cm60s84ew02la07v0ryt7qagq/master'
      }
    }
  },
  seo: {
    meta: {
      description: 'Get all the information you want and need about the moon here.',
      ogTitle: 'Lunatrack - Your Lunar Guide',
      ogDescription: 'Get all the information you want and need about the moon here.',
      ogImage: '/images/moon-phase-images/full-moon.png',
      ogUrl: 'https://lunatrack.info',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Lunatrack - Your Lunar Guide',
      twitterDescription: 'Get all the information you want and need about the moon here.',
      twitterImage: '/images/moon-phase-images/full-moon.png',
      twitterSite: '@lunatrack',
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8'
    }
  },
  site: {
    url: "https://lunatrack.info",
    name: "Lunatrack - your lunar guide"
  },
  sitemap: {
    urls: async () => {
      // In a real implementation, you would fetch your blog posts here
      return [
        '/',
        '/blog'
      ]
    }
  },
  robots: {
    StringAfter: ['Sitemap: https://lunatrack.info/sitemap.xml'],
    rules: {
      UserAgent: '*',
      Allow: '/'
    }
  },
  runtimeConfig: {
    public: {
      moonApiKey: process.env.NUXT_PUBLIC_MOON_API_KEY,
      geocodeApiKey: process.env.NUXT_PUBLIC_GEOCODE_API_KEY
    }
  },
  // Add Nitro configuration for prerendering and improved SSR
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog']
    },
    routeRules: {
      // Specific rules to prevent 500 errors
      '/blog/**': {
        swr: 60 * 60, // Cache for 1 hour
        isr: false
      }
    },
    errorHandler: '~/server/error-handler.ts'
  },
  routeRules: {
    // Apply global route rules
    '/blog': { swr: 60 * 60 * 24 }, // Cache blog index for 24 hours
    '/blog/**': { swr: 60 * 60 * 12 } // Cache blog posts for 12 hours
  },
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true
  },
  ssr: true,
})