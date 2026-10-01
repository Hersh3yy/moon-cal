<template>
  <footer class="relative z-10 mt-12 border-t border-line bg-ink-2/60 backdrop-blur-sm">
    <div class="mx-auto flex max-w-page flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p>
        Made by <a href="https://hiren.ninja" class="link" rel="noopener" target="_blank">Hiren Budhrani</a>
        and <a href="https://stratessa.com/" class="link" rel="noopener" target="_blank">Anna Veerman</a>.
      </p>
      <ul class="flex flex-wrap gap-x-4 gap-y-1" aria-label="Footer">
        <li><NuxtLink to="/" class="link">Tonight's moon</NuxtLink></li>
        <li><NuxtLink to="/blog" class="link">Blog</NuxtLink></li>
        <li><a href="/#about" class="link">About</a></li>
        <li><a href="https://hiren.ninja" class="link" rel="noopener" target="_blank">More by Hiren</a></li>
      </ul>
    </div>
  </footer>
</template>
