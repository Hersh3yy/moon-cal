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
      script: [
        {
          src: 'https://cloud.umami.is/script.js',
          'data-website-id': '6313bd15-0072-466d-a1b6-bfcbb6664898',
          defer: true
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
        httpEndpoint: 'https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/clvkp3ut01ajw07wc38106mxt/master',
        httpLinkOptions: {
          headers: {
            'Authorization': `Bearer bob}`
          }
        }
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
  runtimeConfig: {
    public: {
      moonApiKey: process.env.NUXT_PUBLIC_MOON_API_KEY,
      geocodeApiKey: process.env.NUXT_PUBLIC_GEOCODE_API_KEY
    }
  },
  useHead: {
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Current Moon Phase',
          description: 'Current phase of the moon and related astronomical data',
          datePublished: new Date().toISOString(),
          image: '/images/moon-phase-images/full-moon.png'
        })
      }
    ]
  },
})