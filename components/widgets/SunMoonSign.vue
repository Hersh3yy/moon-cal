<!-- components/widgets/SunMoonSign.vue -->
<template>
    <UiBaseCard :title="props.title" :mode="props.mode" :colSpan="props.colSpan">
        <div class="grid grid-cols-2 gap-4">
            <!-- Sun Sign -->
            <div class="flex items-center gap-4">
                <img :src="getZodiacImage(moonData?.moon?.zodiac?.sun_sign)"
                    :alt="moonData?.moon?.zodiac?.sun_sign" class="w-12 h-12 object-contain" />
                <div class="flex flex-col flex-1">
                    <div class="flex items-center justify-between">
                        <span class="moon-text-primary font-medium">
                            Sun in {{ moonData?.moon?.zodiac?.sun_sign }}
                        </span>
                    </div>
                    <p class="text-sm opacity-75 mt-1">{{ getSunZodiacDescription(moonData?.moon?.zodiac?.sun_sign) }}
                    </p>
                </div>
            </div>

            <!-- Moon Sign -->
            <div class="flex items-center gap-4">
                <img :src="getZodiacImage(moonData?.moon?.zodiac?.moon_sign)"
                    :alt="moonData?.moon?.zodiac?.moon_sign" class="w-12 h-12 object-contain" />
                <div class="flex flex-col flex-1">
                    <div class="flex items-center justify-between">
                        <span class="moon-text-primary font-medium">
                            Moon in {{ moonData?.moon?.zodiac?.moon_sign }}
                        </span>
                    </div>
                    <p class="text-sm opacity-75 mt-1">{{ getMoonZodiacDescription(moonData?.moon?.zodiac?.moon_sign) }}
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
    colSpan: 2
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

// Sun sign descriptions
const sunZodiacDescriptions = {
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

// Moon sign descriptions
const moonZodiacDescriptions = {
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

const getSunZodiacDescription = (sign: string | undefined) => {
    if (!sign) return ''
    return sunZodiacDescriptions[sign as keyof typeof sunZodiacDescriptions] || ''
}

const getMoonZodiacDescription = (sign: string | undefined) => {
    if (!sign) return ''
    return moonZodiacDescriptions[sign as keyof typeof moonZodiacDescriptions] || ''
}
</script> 