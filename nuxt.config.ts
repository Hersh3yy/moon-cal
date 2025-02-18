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
        httpEndpoint: 'https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/cm60s84ew02la07v0ryt7qagq/master',
        httpLinkOptions: {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MzcxMTk4MTcsImF1ZCI6WyJodHRwczovL2FwaS1ldS13ZXN0LTIuaHlncmFwaC5jb20vdjIvY202MHM4NGV3MDJsYTA3djByeXQ3cWFncS9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiMDllYmVhYTUtMDcyYy00NjBlLWIyZjYtY2JhMTk0NDk1NzBkIiwianRpIjoiY2thNWoyZW9iMDN0YzAxd2gwZGZkNjdyeSJ9.bt4bFXFCo92wdRlQl5BSQY3-WXgW-KK1rfFuu2piNi7GBCdvZ036j5QIi4a3oYVugGWnfbOHYJxOmAszsdtSEFP9m9vSNrcqw5zFn8FNdIMeJgAWqXv6-Ix0X2Ms5UpgR9InCRvbHjwhzcg7ItbQRPLZB9wBiHMGcvI4QFEFybx3Dp9TFECdIbpUJ2xvhXWYdA9_G2I_BDeRFG5fvVLKJ2t4g_MxSvf9KcXzOluQjQsw0vNOdYiNqRr_e_vpl7L7u3w4YNOYtD5HmqEw8wyBot_ccwpAfhK6C3jdV1x09CTWtEeag9CB23VVdBoNJ52tErzo2vf-DcKTsSbxxr3jcvIo7CgHhOmXgKK0HRBp7uwsQWHm5SjL_AcFDJfcZaKWNoRHastRfCSAmgYv_l9aa4yDAj9hMOKMtWZ268MAOS5Eoo57_5BWO8YjWgvEalqfpkDnL3x3DhSi6ajDbLJbNtcX0eoM_qTg166EE_P2P7HGv0FxEemv67WgJ-YcfgJpiqv4ST3fZHaaYPnoqB5UQJfUvq1UvqdP1p053QtwDJ0NmQ9b0hh3bTRLbEXsjenA5KPr43-LWAW61-GhDuAS8lIRu2cjcG49O0vsaiCLBIGRzG5caTHJ2d4pCHQwiId9L7OXVt8ZPyqlhasOIQmc8qgqCViI9nUrQTMLGJ2dq4Q`
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