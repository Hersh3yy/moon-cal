<template>
    <div
        class="bg-black/40 backdrop-blur-sm rounded-xl p-4 text-white font-mono text-sm"
    >
        <div class="mb-4">
            <h3 class="text-lg font-bold text-yellow-400 mb-2">
                Debug Information
            </h3>
            <div class="space-y-2">
                <p>Loading: {{ moonStore.loading }}</p>
                <p>Error: {{ moonStore.error }}</p>
                <p>
                    Coordinates:
                    {{ JSON.stringify(moonStore.coordinates, null, 2) }}
                </p>
                <p>
                    Coordinates Request:
                    {{ moonStore.debugInfo?.coordinatesRequest }}
                </p>
                <p>
                    Coordinates Response:
                    {{
                        JSON.stringify(
                            moonStore.debugInfo?.coordinatesResponse,
                            null,
                            2,
                        )
                    }}
                </p>
            </div>
        </div>

        <div v-if="moonStore.error" class="mb-4">
            <h4 class="text-red-400 font-bold mb-2">Error Details:</h4>
            <pre class="bg-red-900/20 p-2 rounded overflow-auto">{{
                moonStore.error
            }}</pre>
        </div>

        <div v-if="moonStore.debugInfo" class="mb-4">
            <h4 class="text-blue-400 font-bold mb-2">Request Details:</h4>
            <pre class="bg-blue-900/20 p-2 rounded overflow-auto">{{
                JSON.stringify(
                    {
                        url: moonStore.debugInfo.url,
                        apiKey: moonStore.debugInfo.apiKey,
                        coordinates: moonStore.debugInfo.coordinates,
                    },
                    null,
                    2,
                )
            }}</pre>
        </div>

        <div v-if="moonStore.debugInfo?.responseStatus" class="mb-4">
            <h4 class="text-green-400 font-bold mb-2">Response Details:</h4>
            <pre class="bg-gray-900/40 p-2 rounded overflow-auto">{{
                JSON.stringify(
                    {
                        status: moonStore.debugInfo.responseStatus,
                        headers: moonStore.debugInfo.responseHeaders,
                    },
                    null,
                    2,
                )
            }}</pre>
        </div>

        <div v-if="moonStore.moonData">
            <h4 class="text-green-400 font-bold mb-2">API Response:</h4>
            <pre
                class="bg-gray-900/40 p-2 rounded overflow-auto max-h-[400px]"
                >{{ JSON.stringify(moonStore.moonData, null, 2) }}</pre
            >
        </div>

        <div v-if="moonStore.calendarData" class="mb-4">
            <h4 class="text-purple-400 font-bold mb-2">Calendar Data:</h4>
            <pre
                class="bg-purple-900/20 p-2 rounded overflow-auto max-h-[400px]"
                >{{ JSON.stringify(moonStore.calendarData, null, 2) }}</pre
            >
        </div>

        <div v-if="moonStore.debugInfo?.calendarError" class="mb-4">
            <h4 class="text-red-400 font-bold mb-2">Calendar Error:</h4>
            <pre class="bg-red-900/20 p-2 rounded overflow-auto">{{
                JSON.stringify(moonStore.debugInfo.calendarError, null, 2)
            }}</pre>
        </div>
    </div>
</template>

<script setup>
const moonStore = useMoonStore();
</script>
