<template>
    <div class="moon-card transition-all duration-300"
        :class="[
        colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1',
        displayMode === 'both' || mode === displayMode ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
    ]">
        <!-- Card Header -->
        <div class="flex items-center justify-between mb-4" v-if="title">
            <h3 class="moon-text-secondary text-lg font-poppins">{{ title }}</h3>
            <slot name="header-right" />
        </div>

        <!-- Card Content -->
        <slot />

        <!-- Card Footer -->
        <slot name="footer" />
    </div>
</template>

<script setup lang="ts">
interface Props {
    title?: string
    mode?: 'science' | 'astrology' | 'both'
    colSpan?: 1 | 2
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'both',
    colSpan: 1
})

// Get current display mode from parent
const displayMode = inject('displayMode', ref('both'))
</script>