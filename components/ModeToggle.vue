<!-- components/ModeToggle.vue -->
<template>
    <div class="mb-8">
        <p class="text-base font-poppins mb-2">Display mode:</p>
        <div class="flex gap-4 items-center">
        <div class="flex gap-2">
            <button 
            v-for="mode in displayModes" 
            :key="mode.value"
            :class="[
                'w-14 h-10 bg-zinc-400/10 rounded-lg flex items-center justify-center',
                props.mode === mode.value ? 'text-white' : 'text-zinc-400'
            ]"
            @click="emit('update:mode', mode.value)"
            >
            <img 
                :src="mode.icon" 
                :alt="`${mode.value} icon`"
                class="w-4 h-4 mr-1"
            />
            <span class="text-xs font-poppins">{{ mode.label }}</span>
            </button>
        </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import scienceIcon from '~/assets/icons/science-icon.png'
import astrologyIcon from '~/assets/icons/astrology-icon.png'

const props = defineProps<{
  mode: string
}>()

const emit = defineEmits<{
  (e: 'update:mode', value: string): void
}>()

const displayModes = [
  { value: 'science', label: 'Science', icon: scienceIcon },
  { value: 'astrology', label: 'Astrology', icon: astrologyIcon }
]
</script>