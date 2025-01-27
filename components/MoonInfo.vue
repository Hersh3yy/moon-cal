<!-- Moon Info-->
<template>
    <div v-if="moonData" class="text-white space-y-4 md:space-y-6 relative z-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div class="bg-black/40 backdrop-blur-sm rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2 text-white">Current Phase</h3>
                <p class="text-2xl font-bold text-white">{{ moonData.moon.phase_name }} {{ moonData.moon.emoji }}</p>
                <p class="text-sm text-white">{{ moonData.moon.illumination }} illuminated</p>
            </div>
            
            <div class="bg-black/40 backdrop-blur-sm rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2 text-white">Moon Age</h3>
                <p class="text-2xl font-bold text-white">{{ moonData.moon.age_days }} days</p>
                <p class="text-sm text-white">{{ moonData.moon.lunar_cycle }} of cycle</p>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="bg-black/40 backdrop-blur-sm rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2 text-white">Next Full Moon</h3>
                <p class="text-xl text-white">{{ formatDays(moonData.moon_phases?.full_moon?.next?.days_ahead) }}</p>
                <p class="text-sm text-white">{{ formatDate(moonData.moon_phases?.full_moon?.next?.datestamp) }}</p>
            </div>

            <div class="bg-black/40 backdrop-blur-sm rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2 text-white">Next New Moon</h3>
                <p class="text-xl text-white">{{ formatDays(moonData.moon_phases?.new_moon?.next?.days_ahead) }}</p>
                <p class="text-sm text-white">{{ formatDate(moonData.moon_phases?.new_moon?.next?.datestamp) }}</p>
            </div>
        </div>

        <div class="bg-black/40 backdrop-blur-sm rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2 text-white">Location & Time</h3>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm text-white">Moonrise</p>
                    <p class="text-white">{{ formatTime(moonData.moon.moonrise_timestamp) || 'N/A' }}</p>
                </div>
                <div>
                    <p class="text-sm text-white">Moonset</p>
                    <p class="text-white">{{ formatTime(moonData.moon.moonset_timestamp) }}</p>
                </div>
            </div>
        </div>

        <div class="bg-black/40 backdrop-blur-sm rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2 text-white">Night Length</h3>
            <p class="text-white">{{ nightLength }}</p>
        </div>

        <div class="bg-black/40 backdrop-blur-sm rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2 text-white">Zodiac Sign</h3>
            <p class="text-white">{{ moonData.moon.zodiac.moon_sign }} {{ getZodiacEmoji(moonData.moon.zodiac.moon_sign) }}</p>
        </div>

        <div class="bg-black/40 backdrop-blur-sm rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2 text-white">Lunar Calendar</h3>
            <div class="space-y-2">
                <div>
                    <p class="text-sm text-white">Next New Moon</p>
                    <p class="text-white">{{ formatDate(moonData.moon_phases?.new_moon?.next?.datestamp) }}</p>
                    <p class="text-sm text-white opacity-75">{{ moonData.moon_phases?.new_moon?.next?.days_ahead }} days away</p>
                </div>
                <div>
                    <p class="text-sm text-white">Next Full Moon</p>
                    <p class="text-white">{{ formatDate(moonData.moon_phases?.full_moon?.next?.datestamp) }}</p>
                    <p class="text-sm text-white opacity-75">{{ moonData.moon_phases?.full_moon?.next?.name }}</p>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="text-white text-center">
        Loading moon data...
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMoonStore } from '@/stores/moon'

const moonStore = useMoonStore()
const moonData = computed(() => moonStore.moonData)

function formatDays(days) {
    if (!days) return 'N/A'
    return `In ${days} days`
}

function formatDate(datestamp) {
    if (!datestamp) return 'N/A'
    return new Date(datestamp).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

function formatTime(timestamp) {
    if (!timestamp) return 'N/A'
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getZodiacEmoji(sign) {
    const zodiacEmojis = {
        Aries: '♈',
        Taurus: '♉',
        Gemini: '♊',
        Cancer: '♋',
        Leo: '♌',
        Virgo: '♍',
        Libra: '♎',
        Scorpio: '♏',
        Sagittarius: '♐',
        Capricorn: '♑',
        Aquarius: '♒',
        Pisces: '♓',
    };
    return zodiacEmojis[sign] || '';
}

const nightLength = computed(() => {
    const sunsetTimestamp = moonStore.sunset; // Use the getter for sunset
    const sunriseTimestamp = moonStore.sunrise; // Use the getter for sunrise

    if (sunsetTimestamp && sunriseTimestamp) {
        // Calculate the night length as the time from sunset to the next sunrise
        const nightLengthInSeconds = 24 * 60 * 60 - (sunsetTimestamp - sunriseTimestamp); // Total seconds in a day minus the difference

        // Convert seconds to hours and minutes
        const hours = Math.floor(nightLengthInSeconds / 3600);
        const minutes = Math.floor((nightLengthInSeconds % 3600) / 60);

        return `${hours} hours ${minutes} minutes`; // Return formatted night length
    }
    return 'N/A'; // Return 'N/A' if data is not available
});
</script>