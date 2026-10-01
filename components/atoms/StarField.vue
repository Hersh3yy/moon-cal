<template>
  <div class="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <picture>
      <source type="image/avif" srcset="/images/starry-1280.avif 1280w, /images/starry-1920.avif 1920w" sizes="100vw" />
      <source type="image/webp" srcset="/images/starry-1280.webp 1280w, /images/starry-1920.webp 1920w" sizes="100vw" />
      <img src="/images/starry-1920.jpg" alt="" width="1920" height="1280" class="h-full w-full object-cover" decoding="async" fetchpriority="low" />
    </picture>
    <div class="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/80" />
  </div>
</template>
