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
        httpEndpoint: 'https://eu-west-2.cdn.hygraph.com/content/cm60s84ew02la07v0ryt7qagq/master',
        httpLinkOptions: {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3Mzk3MzcwNzIsImF1ZCI6WyJodHRwczovL2FwaS1ldS13ZXN0LTIuaHlncmFwaC5jb20vdjIvY202MHM4NGV3MDJsYTA3djByeXQ3cWFncS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiY2IzMmI4NWEtYmNlYS00ZjljLTk5MjMtZWQwZmFlZTUxMGViIiwianRpIjoiY203ODJqODV0MHczNzA3bDYxcW8zMWNoeiJ9.obCgdjH4kMnNTq6ZMpHEDQUZHe4FegO38mmMq4rJ_D85UqxU6RIoC-58chzOSnEHLZt1FYrNw9ApyqJq7BooHpah4gSK_m9kogj7qY3v8BjMqOCIpX1sSQBqmywGC-NpCL57ikQEw48NkEoql4sK4nJ7uhORQVJKziCChYGN5DDWGBjJ6Sds6jXWtLm_IlLFxpPUS3YV8IIQR2zvTISVFO4X9JnK58z3NbjWoyVQlrhW2lM-VlllmHJoakI_lpd1Y7d_g48owufrSphjqoB9JRXcV2DwIKYyGY9ZKPo3WnNQaTjp0IZ49nt9HgSMMbPjLEOEo6TMZAh8BX2JpBE6-1gZJ4Oy1OICJWkOs3TEmBUEzFhDQ5aYpIar9FODTix6Eh3XGX3pMaV3CcFaohT0EcshVuo7FSUeKo6S1exfT_MR0gRMBY8rqOzRUJJNVajiK4kZKkWS7XkU4Zs-sSkxRUxiKHqHsm8cMeal18NC_GQwZe_qjU6rJViWbgXRWqGW68z0_ATmBzq7-wRCmoOq3TW216skctSEMkIevLYCqeN8-DuyMIYBw63xdy5edhOjs2iPiU36QO0qeQLXDeofAEAYmUTHdZWstnQ2Gd0IAmwj_Dm7S7INFAEaeYd1IbF3jHBGhufSksbcr3idDBXRNg8es28kjP1-QbVdQ6pv4PE`
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
})