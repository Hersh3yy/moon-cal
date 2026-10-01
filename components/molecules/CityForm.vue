<template>
  <form class="flex items-center gap-2" @submit.prevent="submit">
    <label :for="inputId" class="sr-only">City</label>
    <input
      :id="inputId"
      ref="input"
      v-model="query"
      type="search"
      name="city"
      autocomplete="off"
      enterkeyhint="search"
      placeholder="City, e.g. Lisbon"
      class="h-11 w-full min-w-0 flex-1 rounded-xl border border-line bg-white/[0.06] px-3 text-base text-moon-50 placeholder:text-moon-500 sm:h-10"
      :aria-describedby="hintId"
    />
    <p :id="hintId" class="sr-only">Press Enter to look the city up.</p>
    <button
      type="submit"
      :disabled="busy || query.trim().length < 2"
      class="h-11 shrink-0 rounded-xl border border-line bg-glow-300/20 px-3 text-sm font-medium text-moon-50 transition-colors hover:bg-glow-300/30 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10"
    >
      {{ busy ? 'Looking up…' : 'Set' }}
    </button>
    <IconButton label="Cancel" icon="close" :disabled="busy" @click="emit('cancel')" />
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ initial?: string; busy?: boolean }>()
const emit = defineEmits<{ submit: [query: string]; cancel: [] }>()

const inputId = useId()
const hintId = useId()
const query = ref(props.initial ?? '')
const input = ref<HTMLInputElement | null>(null)

onMounted(() => {
  input.value?.focus()
  input.value?.select()
})

function submit() {
  if (!props.busy && query.value.trim().length >= 2) emit('submit', query.value)
}
</script>
