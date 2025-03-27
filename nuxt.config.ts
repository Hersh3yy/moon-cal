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
      meta: [
        { name: 'description', content: 'Get all the information you want and need about the moon here.' },
        { property: 'og:title', content: 'Lunatrack - Your Lunar Guide' },
        { property: 'og:description', content: 'Get all the information you want and need about the moon here.' },
        { property: 'og:image', content: '/images/moon-phase-images/full-moon.png' },
        { property: 'og:url', content: 'https://lunatrack.info' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Lunatrack - Your Lunar Guide' },
        { name: 'twitter:description', content: 'Get all the information you want and need about the moon here.' },
        { name: 'twitter:image', content: '/images/moon-phase-images/full-moon.png' },
        { name: 'twitter:site', content: '@lunatrack' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' }
      ],
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
  modules: ["@pinia/nuxt", "@nuxtjs/apollo"],
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'https://eu-west-2.cdn.hygraph.com/content/cm60s84ew02la07v0ryt7qagq/master'
      }
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
        swr: 60 * 60 // Cache for 1 hour
      }
    }
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