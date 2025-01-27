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
  build: {
    transpile: [
      "@headlessui/vue",
      "@heroicons/vue",
    ]
  },
  modules: [
    "@pinia/nuxt"
  ],
  runtimeConfig: {
    public: {
      moonApiKey: process.env.NUXT_PUBLIC_MOON_API_KEY,
      geocodeApiKey: process.env.NUXT_PUBLIC_GEOCODE_API_KEY
    }
  }
})
