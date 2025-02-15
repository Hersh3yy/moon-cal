interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_status' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const useSeo = (options: SeoOptions) => {
  const config = useRuntimeConfig();
  const route = useRoute();

  const {
    title = 'Lunatrack - Your Lunar Guide',
    description = 'Get all the information you want and need about the moon here.',
    image = '/images/moon-phase-images/full-moon.png',
    url = `https://lunatrack.info${route.fullPath}`,
    type = 'website',
    keywords = ['moon', 'lunar', 'moon phases', 'lunar calendar', 'moon distance', 'moon signs', 'celestial events'],
    author = 'Lunatrack',
    publishedTime,
    modifiedTime
  } = options;

  // Use both useHead and useSeoMeta for maximum compatibility
  useHead({
    title,
    meta: [
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'author', content: author },
      { name: 'robots', content: 'index, follow' }
    ],
    link: [
      { rel: 'canonical', href: url }
    ],
    htmlAttrs: {
      lang: 'en'
    }
  });

  useSeoMeta({
    title: () => title,
    ogTitle: () => title,
    description: () => description,
    ogDescription: () => description,
    ogImage: () => image,
    ogUrl: () => url,
    ogType: () => type,
    ogSiteName: 'Lunatrack',
    twitterCard: () => 'summary_large_image',
    twitterTitle: () => title,
    twitterDescription: () => description,
    twitterImage: () => image,
    twitterSite: () => '@lunatrack',
    articleAuthor: () => author,
    articlePublishedTime: () => publishedTime,
    articleModifiedTime: () => modifiedTime,
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
    themeColor: '#ffffff',
    colorScheme: 'light dark'
  });
};