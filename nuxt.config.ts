// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_URL = 'https://lunatrack.info'
const SITE_NAME = 'Lunatrack'
const DEFAULT_TITLE = 'Moon phase tonight, for where you are'
const DEFAULT_DESCRIPTION =
  "Tonight's moon for your location: phase and illumination, moonrise and moonset, moon sign, the next full moon and the best time to look up."
const HYGRAPH_ENDPOINT =
  process.env.NUXT_HYGRAPH_ENDPOINT ||
  'https://eu-west-2.cdn.hygraph.com/content/cm60s84ew02la07v0ryt7qagq/master'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@nuxtjs/robots', '@nuxtjs/sitemap'],

  // Atomic design: atoms / molecules / organisms. Components are named by file name only.
  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Hybrid rendering. The home page is client-only (its data is fetched live per visitor);
  // the blog is prerendered at build so posts ship as real HTML with their own meta tags.
  ssr: true,
  routeRules: {
    '/': { ssr: false, prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(self), camera=(), microphone=()',
        'X-Frame-Options': 'DENY',
      },
    },
  },
  nitro: {
    prerender: {
      // blog/slug.html instead of blog/slug/index.html, so Netlify serves /blog/slug without
      // a 301 to the trailing-slash URL (canonical and sitemap use the slash-less form).
      autoSubfolderIndex: false,
      crawlLinks: true,
      routes: ['/', '/blog', '/sitemap.xml', '/robots.txt'],
      failOnError: false,
    },
  },
  hooks: {
    // Make sure every published post is prerendered, even if the crawler misses a link.
    async 'prerender:routes'(ctx) {
      try {
        const res = await fetch(HYGRAPH_ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ query: '{ posts { slug } }' }),
        })
        const json = (await res.json()) as { data?: { posts?: { slug: string }[] } }
        for (const post of json.data?.posts ?? []) ctx.routes.add(`/blog/${post.slug}`)
      } catch (error) {
        console.warn('[prerender] could not list blog posts:', error)
      }
    },
  },

  site: { url: SITE_URL, name: SITE_NAME },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    excludeAppSources: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: DEFAULT_TITLE,
      titleTemplate: `%s %separator ${SITE_NAME}`,
      templateParams: { separator: '·' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: DEFAULT_DESCRIPTION },
        { name: 'theme-color', content: '#05060a' },
        { name: 'color-scheme', content: 'dark' },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: `${SITE_NAME} — ${DEFAULT_TITLE}` },
        { property: 'og:description', content: DEFAULT_DESCRIPTION },
        { property: 'og:image', content: `${SITE_URL}/og-default.jpg` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'A full moon on a starry sky with the word Lunatrack' },
        { property: 'og:url', content: `${SITE_URL}/` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${SITE_NAME} — ${DEFAULT_TITLE}` },
        { name: 'twitter:description', content: DEFAULT_DESCRIPTION },
        { name: 'twitter:image', content: `${SITE_URL}/og-default.jpg` },
        { name: 'twitter:site', content: '@lunatrack' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      script: [
        {
          src: 'https://cloud.umami.is/script.js',
          'data-website-id': '6313bd15-0072-466d-a1b6-bfcbb6664898',
          defer: true,
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: SITE_NAME,
                url: `${SITE_URL}/`,
                description: DEFAULT_DESCRIPTION,
                inLanguage: 'en',
                publisher: { '@id': `${SITE_URL}/#organization` },
              },
              {
                '@type': 'Organization',
                '@id': `${SITE_URL}/#organization`,
                name: SITE_NAME,
                url: `${SITE_URL}/`,
                logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 512, height: 512 },
                founder: { '@type': 'Person', name: 'Hiren Budhrani', url: 'https://hiren.ninja' },
              },
              {
                '@type': 'WebApplication',
                name: SITE_NAME,
                url: `${SITE_URL}/`,
                applicationCategory: 'ReferenceApplication',
                operatingSystem: 'Any',
                browserRequirements: 'Requires JavaScript',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
                description: DEFAULT_DESCRIPTION,
              },
            ],
          }),
        },
      ],
    },
  },

  runtimeConfig: {
    // Private: only Nitro server routes see these. The browser calls /api/* instead.
    // The old NUXT_PUBLIC_* names still work as a fallback so the Netlify env keeps working
    // until the variables are renamed (and the RapidAPI key rotated).
    moonApiKey: process.env.NUXT_MOON_API_KEY || process.env.NUXT_PUBLIC_MOON_API_KEY || '',
    geocodeApiKey: process.env.NUXT_GEOCODE_API_KEY || process.env.NUXT_PUBLIC_GEOCODE_API_KEY || '',
    postsSource: process.env.NUXT_POSTS_SOURCE || 'hygraph',
    hygraphEndpoint: HYGRAPH_ENDPOINT,
    vamsUrl: process.env.NUXT_VAMS_URL || 'https://app.use-vams.me',
    vamsApiKey: process.env.NUXT_VAMS_API_KEY || '',
    vamsPostType: process.env.NUXT_VAMS_POST_TYPE || 'moon-post',
    public: {
      siteUrl: SITE_URL,
      siteName: SITE_NAME,
    },
  },
})
