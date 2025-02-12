// components/widgets/SunSign.vue
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex items-center gap-4">
            <img :src="getZodiacImage(moonData?.moon?.zodiac?.sun_sign)" :alt="moonData?.moon?.zodiac?.sun_sign"
                class="w-12 h-12 object-contain" />
            <div class="flex flex-col flex-1">
                <div class="flex items-center justify-between">
                    <span class="moon-text-primary">{{ moonData?.moon?.zodiac?.sun_sign }}</span>
                </div>
                <p class="text-sm opacity-75 mt-1">{{ getZodiacDescription(moonData?.moon?.zodiac?.sun_sign) }}</p>
            </div>
        </div>
    </UiBaseCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMoonStore } from '@/stores/moon'
import type { BaseWidgetProps } from '@/types/widget'
import ariesIcon from '~/assets/images/zodiac/aries.svg'
import taurusIcon from '~/assets/images/zodiac/taurus.svg'
import geminiIcon from '~/assets/images/zodiac/gemini.svg'
import cancerIcon from '~/assets/images/zodiac/cancer.svg'
import leoIcon from '~/assets/images/zodiac/leo.svg'
import virgoIcon from '~/assets/images/zodiac/virgo.svg'
import libraIcon from '~/assets/images/zodiac/libra.svg'
import scorpioIcon from '~/assets/images/zodiac/scorpio.svg'
import sagittariusIcon from '~/assets/images/zodiac/sagittarius.svg'
import capricornIcon from '~/assets/images/zodiac/capricorn.svg'
import aquariusIcon from '~/assets/images/zodiac/aquarius.svg'
import piscesIcon from '~/assets/images/zodiac/pisces.svg'

const props = withDefaults(defineProps<BaseWidgetProps>(), {
    mode: 'astrology',
    colSpan: 1
})

const { moonData } = storeToRefs(useMoonStore())

// Map zodiac signs to their imported images
const zodiacImages = {
    'Aries': ariesIcon,
    'Taurus': taurusIcon,
    'Gemini': geminiIcon,
    'Cancer': cancerIcon,
    'Leo': leoIcon,
    'Virgo': virgoIcon,
    'Libra': libraIcon,
    'Scorpio': scorpioIcon,
    'Sagittarius': sagittariusIcon,
    'Capricorn': capricornIcon,
    'Aquarius': aquariusIcon,
    'Pisces': piscesIcon,
}

// Function to get the correct zodiac image based on sign
const getZodiacImage = (sign: string | undefined) => {
    if (!sign) return aquariusIcon // Default fallback
    return zodiacImages[sign as keyof typeof zodiacImages] || aquariusIcon
}

// Optional: Add descriptions for each sign
const zodiacDescriptions = {
    'Aries': 'The first sign of the zodiac, ruled by Mars',
    'Taurus': 'The fixed earth sign, ruled by Venus',
    'Gemini': 'The mutable air sign, ruled by Mercury',
    'Cancer': 'The cardinal water sign, ruled by the Moon',
    'Leo': 'The fixed fire sign, ruled by the Sun',
    'Virgo': 'The mutable earth sign, ruled by Mercury',
    'Libra': 'The cardinal air sign, ruled by Venus',
    'Scorpio': 'The fixed water sign, ruled by Pluto',
    'Sagittarius': 'The mutable fire sign, ruled by Jupiter',
    'Capricorn': 'The cardinal earth sign, ruled by Saturn',
    'Aquarius': 'The fixed air sign, ruled by Uranus',
    'Pisces': 'The mutable water sign, ruled by Neptune'
}

const getZodiacDescription = (sign: string | undefined) => {
    if (!sign) return ''
    return zodiacDescriptions[sign as keyof typeof zodiacDescriptions] || ''
}
</script>