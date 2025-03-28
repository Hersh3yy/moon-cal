<!-- components/widgets/NextFullMoon.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <span class="moon-text-primary">{{ nextFullMoon?.name }}</span>
            </div>
            <div class="flex items-center gap-4">
                <img :src="getMoonImage(nextFullMoon?.name)"
                    :alt="nextFullMoon?.name" class="w-12 h-12 object-contain" />
                <div class="flex flex-col flex-1">
                    <p class="text-sm opacity-75">{{ nextFullMoon?.description }}</p>
                    <a :href="getTimeAndDateLink" target="_blank"
                        class="text-sm text-blue-400 hover:text-blue-300 mt-1">
                        Learn more about {{ nextFullMoon?.name }}
                    </a>
                    <p class="text-sm opacity-75 mt-1">
                        {{ new Date(nextFullMoon?.timestamp ?
                            nextFullMoon?.timestamp * 1000 : 0).toLocaleDateString() }}
                    </p>
                </div>
            </div>
        </div>
    </UiBaseCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMoonStore } from '@/stores/moon'
import type { BaseWidgetProps } from '@/types/widget'
import beaverMoonIcon from '~/assets/images/full-moon-types/beaver-moon.png'
import buckMoonIcon from '~/assets/images/full-moon-types/buck-moon.png'
import coldMoonIcon from '~/assets/images/full-moon-types/cold-moon.png'
import flowerMoonIcon from '~/assets/images/full-moon-types/flower-moon.png'
import hunterMoonIcon from '~/assets/images/full-moon-types/hunter-moon.png'
import pinkMoonIcon from '~/assets/images/full-moon-types/pink-moon.png'
import snowMoonIcon from '~/assets/images/full-moon-types/snow-moon.png'
import strawberryMoonIcon from '~/assets/images/full-moon-types/strawberry-moon.png'
import sturgeonMoonIcon from '~/assets/images/full-moon-types/sturgeon-moon.png'
import wolfMoonIcon from '~/assets/images/full-moon-types/wolf-moon.png'
import wormMoonIcon from '~/assets/images/full-moon-types/worm-moon.png'

const props = withDefaults(defineProps<BaseWidgetProps>(), {
    mode: 'both',
    colSpan: 2
})

const { moonData } = storeToRefs(useMoonStore())

// Computed property to handle both API response structures
const nextFullMoon = computed(() => {
    // Try new structure first
    const newStructure = moonData.value?.moon?.detailed?.upcoming_phases?.full_moon?.next;
    if (newStructure) return newStructure;

    // Fallback to old structure
    const oldStructure = moonData.value?.moon_phases?.full_moon?.next;
    if (oldStructure) {
        console.warn('Using deprecated moon_phases structure for next full moon data');
        return oldStructure;
    }

    // If neither exists, return undefined
    return undefined;
})

// Map moon names to their imported images
const moonImages = {
    'Beaver Moon': beaverMoonIcon,
    'Buck Moon': buckMoonIcon,
    'Cold Moon': coldMoonIcon,
    'Flower Moon': flowerMoonIcon,
    'Hunter Moon': hunterMoonIcon,
    'Pink Moon': pinkMoonIcon,
    'Snow Moon': snowMoonIcon,
    'Strawberry Moon': strawberryMoonIcon,
    'Sturgeon Moon': sturgeonMoonIcon,
    'Wolf Moon': wolfMoonIcon,
    'Worm Moon': wormMoonIcon,
}

// Function to get the correct moon image based on name
const getMoonImage = (moonName: string | undefined) => {
    if (!moonName) return wolfMoonIcon // Default fallback
    return moonImages[moonName as keyof typeof moonImages] || wolfMoonIcon
}

const getTimeAndDateLink = computed(() => {
    const moonName = nextFullMoon.value?.name
    if (!moonName) return ''
    const linkName = moonName.toLowerCase().replace(' moon', '').replace(' ', '')
    return `https://www.timeanddate.com/astronomy/moon/${linkName}.html`
})
</script>