<template>
    <div class="text-white space-y-6">
        <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2">Current Phase</h3>
                <p class="text-2xl font-bold">{{ moonData.phase_name }}</p>
                <p class="text-sm opacity-75">{{ moonData.illumination }}% illuminated</p>
            </div>

            <div class="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2">Moon Age</h3>
                <p class="text-2xl font-bold">{{ moonData.age_days }} days</p>
                <p class="text-sm opacity-75">{{ moonData.lunar_cycle }}% of cycle</p>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2">Next Full Moon</h3>
                <p class="text-xl">{{ formatDays(moonData.moon_phases?.full_moon?.next?.days_ahead) }}</p>
                <p class="text-sm opacity-75">{{ formatDate(moonData.moon_phases?.full_moon?.next?.datestamp) }}</p>
            </div>

            <div class="bg-white/5 backdrop-blur-sm rounded-lg p-4">
                <h3 class="text-lg font-medium mb-2">Next New Moon</h3>
                <p class="text-xl">{{ formatDays(moonData.moon_phases?.new_moon?.next?.days_ahead) }}</p>
                <p class="text-sm opacity-75">{{ formatDate(moonData.moon_phases?.new_moon?.next?.datestamp) }}</p>
            </div>
        </div>

        <div class="bg-white/5 backdrop-blur-sm rounded-lg p-4">
            <h3 class="text-lg font-medium mb-2">Location & Time</h3>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-sm opacity-75">Moonrise</p>
                    <p>{{ formatTime(moonData.moonrise) }}</p>
                </div>
                <div>
                    <p class="text-sm opacity-75">Moonset</p>
                    <p>{{ formatTime(moonData.moonset) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { moonStore } = useStore()
const moonData = computed(() => moonStore.moonData)

function formatDays(days) {
    if (!days) return 'Loading...'
    return `In ${days} days`
}

function formatDate(datestamp) {
    if (!datestamp) return ''
    return new Date(datestamp).toLocaleDateString()
}

function formatTime(timestamp) {
    if (!timestamp) return 'Loading...'
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>