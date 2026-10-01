<template>
  <div class="inline-flex items-center gap-3">
    <button
      type="button"
      class="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white/[0.06] px-3 text-sm font-medium text-moon-50 transition-colors hover:bg-white/[0.14]"
      @click="share"
    >
      <AppIcon :name="copied ? 'check' : 'share'" :size="16" />
      {{ copied ? 'Link copied' : 'Share' }}
    </button>
    <span class="sr-only" role="status" aria-live="polite">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title: string; url: string; text?: string }>()
const copied = ref(false)
const status = ref('')

async function share() {
  try {
    if (typeof navigator.share === 'function') {
      await navigator.share({ title: props.title, text: props.text, url: props.url })
      status.value = 'Shared'
      return
    }
    await navigator.clipboard.writeText(props.url)
    copied.value = true
    status.value = 'Link copied to clipboard'
    setTimeout(() => (copied.value = false), 2500)
  } catch {
    status.value = 'Could not share'
  }
}
</script>
