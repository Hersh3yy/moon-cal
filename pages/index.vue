<template>
    <div class="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center">
        <div class="container mx-auto px-4 py-8 md:py-12">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-8 md:mb-12">
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Current Moon Phase
                    </h1>
                    <p class="text-gray-300 text-lg md:text-xl">
                        Discover the moon's current position and phase
                    </p>
                </div>

                <div class="mb-8">
                    <input type="text" v-model="city" placeholder="Enter city name"
                        class="p-2 rounded-md border border-gray-300 text-black" />
                    <button @click="getCoordinates" class="ml-2 p-2 bg-blue-500 text-white rounded-md">
                        Get Moon Data
                    </button>
                </div>

                <div class="bg-black/30 backdrop-blur-sm rounded-xl p-4 md:p-8 lg:p-12 shadow-xl">
                    <div v-if="moonStore.loading" class="flex flex-col items-center justify-center py-12">
                        <div class="moon-loader mb-4"></div>
                        <p class="text-white text-lg animate-pulse">
                            Loading moon data...
                        </p>
                    </div>

                    <div v-else-if="moonStore.moonData" class="space-y-8 md:space-y-12">
                        <MoonDisplay />
                        <MoonInfo />
                    </div>
                </div>

                <!-- Debug Information -->
                <DebugInfo />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMoonStore } from "@/stores/moon";

const moonStore = useMoonStore();
const city = ref("Amsterdam"); // Set default city to Amsterdam

const getCoordinates = async () => {
    await moonStore.getCoordinatesFromCity(city.value);
};

// Fetch moon data when the component is mounted
onMounted(() => {
    getCoordinates();
});
</script>
