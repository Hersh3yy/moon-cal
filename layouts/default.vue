<template>
  <div class="flex min-h-screen flex-col">
    <SkipLink />
    <StarField />
    <SiteHeader />
    <main id="main" tabindex="-1" class="relative z-10 mx-auto w-full max-w-page flex-1 px-4 pb-12 pt-24 focus:outline-none sm:px-6">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
