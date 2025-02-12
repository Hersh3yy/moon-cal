<!-- components/widgets/MoonPhase.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="moon-text-primary">{{ moonData?.moon?.phase_name }}</span>
                    <span class="text-xl">{{ moonData?.moon?.emoji }}</span>
                </div>
            </div>
            <p class="text-sm opacity-75 text-right">{{ moonData?.moon?.illumination }} illuminated</p>
        </div>
    </UiBaseCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMoonStore } from '@/stores/moon'
import type { BaseWidgetProps } from '@/types/widget'

const props = withDefaults(defineProps<BaseWidgetProps>(), {
    mode: 'both',
    colSpan: 1
})

const { moonData } = storeToRefs(useMoonStore())
</script>