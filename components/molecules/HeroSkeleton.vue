<template>
  <div class="flex flex-col items-center gap-5 text-center" aria-busy="true" role="status">
    <div class="relative h-56 w-56 p-3 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80">
      <div class="h-full w-full animate-pulse rounded-full bg-white/10" />
    </div>
    <div class="space-y-3">
      <div class="mx-auto h-9 w-56 animate-pulse rounded-lg bg-white/10" />
      <div class="mx-auto h-5 w-72 animate-pulse rounded-lg bg-white/[0.07]" />
    </div>
    <div class="mx-auto h-5 w-80 max-w-full animate-pulse rounded-lg bg-white/[0.07]" />
    <span class="sr-only">Loading moon data</span>
  </div>
</template>
