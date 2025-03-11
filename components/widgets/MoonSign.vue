// components/widgets/MoonSign.vue
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="flex items-center gap-4">
            <img :src="getZodiacImage(moonData?.moon?.zodiac?.moon_sign?.name)"
                :alt="moonData?.moon?.zodiac?.moon_sign?.name" class="w-12 h-12 object-contain" />
            <div class="flex flex-col flex-1">
                <div class="flex items-center justify-between">
                    <span class="moon-text-primary">
                        {{ moonData?.moon?.zodiac?.moon_sign?.name }}
                        <span class="ml-1 text-sm opacity-75">{{ moonData?.moon?.zodiac?.moon_sign?.symbol }}</span>
                    </span>
                </div>
                <p class="text-sm opacity-75 mt-1">{{ getZodiacDescription(moonData?.moon?.zodiac?.moon_sign?.name) }}
                </p>
                <p class="text-xs opacity-50 mt-1">
                    {{ moonData?.moon?.zodiac?.moon_sign?.start?.month }}/{{
                        moonData?.moon?.zodiac?.moon_sign?.start?.day }} -
                    {{ moonData?.moon?.zodiac?.moon_sign?.end?.month }}/{{ moonData?.moon?.zodiac?.moon_sign?.end?.day
                    }}
                </p>
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
    if (!sign) return leoIcon // Default fallback (since current moon sign is Leo in the data)
    return zodiacImages[sign as keyof typeof zodiacImages] || leoIcon
}

// Moon-specific descriptions that focus on emotional and intuitive aspects
const zodiacDescriptions = {
    'Aries': 'Emotionally dynamic and instinctively courageous',
    'Taurus': 'Emotional security through material comfort and stability',
    'Gemini': 'Processes feelings through communication and curiosity',
    'Cancer': 'Deeply intuitive with strong emotional memory',
    'Leo': 'Expresses emotions with warmth and dramatic flair',
    'Virgo': 'Processes emotions through practical analysis',
    'Libra': 'Seeks emotional harmony and balance in relationships',
    'Scorpio': 'Deep emotional intensity and psychological insight',
    'Sagittarius': 'Emotional freedom through exploration and growth',
    'Capricorn': 'Emotional restraint with deep inner security',
    'Aquarius': 'Processes feelings through intellectual understanding',
    'Pisces': 'Highly empathetic with flowing emotional awareness'
}

const getZodiacDescription = (sign: string | undefined) => {
    if (!sign) return ''
    return zodiacDescriptions[sign as keyof typeof zodiacDescriptions] || ''
}
</script>