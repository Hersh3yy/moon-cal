<template>
  <dialog
    ref="dialog"
    class="glass m-auto w-[min(92vw,34rem)] bg-ink-2/95 p-0 text-moon-100 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    :aria-labelledby="titleId"
    @close="emit('update:open', false)"
    @click="onBackdropClick"
  >
    <div class="relative p-6 sm:p-8">
      <IconButton label="Close" icon="close" class="absolute right-3 top-3" @click="close" />
      <h2 :id="titleId" class="font-display text-2xl text-moon-50">About Lunatrack</h2>
      <div class="mt-4 space-y-4 text-base text-moon-300">
        <p>
          Lunatrack shows you tonight's moon for where you are: its phase and how much of it is lit, when it rises and sets,
          which sign it is in, the next full moon and the best time to look up.
        </p>
        <p>
          The numbers come from an astronomical data service for your exact coordinates; eclipses are computed in your
          browser with the open-source Astronomy Engine. Your location never leaves this site's own server.
        </p>
        <div class="border-t border-line pt-4">
          <h3 class="mb-2 text-sm font-medium uppercase tracking-wider text-muted">Made by</h3>
          <ul class="space-y-1">
            <li><a href="https://hiren.ninja" class="link" target="_blank" rel="noopener">Hiren Budhrani</a> — design and code</li>
            <li><a href="https://stratessa.com/" class="link" target="_blank" rel="noopener">Anna Veerman</a> — words and moon lore</li>
          </ul>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const dialog = ref<HTMLDialogElement | null>(null)
const titleId = useId()

// The native <dialog> gives us the focus trap, Escape handling, inert background and
// focus return for free. We only sync it with the `open` prop.
watch(
  () => props.open,
  (open) => {
    const el = dialog.value
    if (!el) return
    if (open && !el.open) el.showModal()
    else if (!open && el.open) el.close()
  },
)

function close() {
  emit('update:open', false)
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialog.value) close()
}
</script>
