interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_status' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
}

export const useSeo = (options: SeoOptions) => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const {
    title = 'Lunatrack - Your Lunar Guide',
    description = 'Get all the information you want and need about the moon here.',
    image = '/images/moon-phase-images/full-moon.png',
    url = `https://lunatrack.info${route.fullPath}`,
    type = 'website'
  } = options;

  useServerSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    ogImage: () => image,
    ogUrl: () => url,
    ogType: () => type as 'website' | 'article',
    twitterCard: () => 'summary_large_image',
    twitterTitle: () => title,
    twitterDescription: () => description,
    twitterImage: () => image,
  });

  useHead({
    title,
    link: [
      { rel: 'canonical', href: url }
    ],
    htmlAttrs: {
      lang: 'en'
    }
  });
};