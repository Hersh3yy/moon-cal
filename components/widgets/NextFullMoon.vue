<!-- components/widgets/NextFullMoon.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
                <span class="moon-text-secondary">Next Full Moon:</span>
                <span class="moon-text-primary">{{ moonData?.moon_phases?.full_moon?.next?.name }}</span>
            </div>
            <div class="flex items-center gap-4">
                <img :src="getMoonImage(moonData?.moon_phases?.full_moon?.next?.name)"
                    :alt="moonData?.moon_phases?.full_moon?.next?.name" class="w-12 h-12 object-contain" />
                <div class="flex flex-col flex-1">
                    <p class="text-sm opacity-75">{{ moonData?.moon_phases?.full_moon?.next?.description }}</p>
                    <a :href="getTimeAndDateLink" target="_blank"
                        class="text-sm text-blue-400 hover:text-blue-300 mt-1">
                        Learn more about {{ moonData?.moon_phases?.full_moon?.next?.name }}
                    </a>
                    <p class="text-sm opacity-75 mt-1">
                        {{ new Date(moonData?.moon_phases?.full_moon?.next?.timestamp ?
                            moonData?.moon_phases?.full_moon?.next?.timestamp * 1000 : 0).toLocaleDateString() }}
                    </p>
                </div>
            </div>
        </div>
    </UiBaseCard>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMoonStore } from '@/stores/moon'
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

interface Props {
    title?: string
    mode?: 'science' | 'astrology' | 'both'
    colSpan?: 1 | 2
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Next Full Moon',
    mode: 'both',
    colSpan: 2
})

const { moonData } = storeToRefs(useMoonStore())

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
    const moonName = moonData.value?.moon_phases?.full_moon?.next?.name
    if (!moonName) return ''
    const linkName = moonName.toLowerCase().replace(' moon', '').replace(' ', '')
    return `https://www.timeanddate.com/astronomy/moon/${linkName}.html`
})
</script>