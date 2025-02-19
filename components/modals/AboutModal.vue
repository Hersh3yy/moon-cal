<!-- components/modals/AboutModal.vue -->
<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="close"></div>

        <!-- Modal panel -->
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-zinc-900 bg-opacity-90 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <!-- Close button -->
                <button @click="close" class="absolute right-4 top-4 text-gray-400 hover:text-white">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Content -->
                <div class="mt-3 text-center sm:mt-5">
                    <h3 class="text-2xl font-semibold leading-6 text-white mb-4" id="modal-title">
                        About Lunatrack
                    </h3>
                    <div class="mt-4 space-y-4 text-left text-gray-300">
                        <p>
                            Welcome to Lunatrack, your comprehensive lunar guide. We provide real-time information about the moon's phases, position, and celestial events to help you stay connected with our closest celestial neighbor.
                        </p>
                        
                        <div class="border-t border-gray-700 pt-4">
                            <h4 class="text-lg font-semibold text-white mb-2">Features</h4>
                            <ul class="list-disc list-inside space-y-2">
                                <li>Real-time moon phase visualization</li>
                                <li>Accurate lunar data based on your location</li>
                                <li>Moon rise and set times</li>
                                <li>Upcoming lunar events</li>
                                <li>Astronomical calculations and predictions</li>
                            </ul>
                        </div>

                        <div class="border-t border-gray-700 pt-4">
                            <h4 class="text-lg font-semibold text-white mb-2">Created By</h4>
                            <div class="flex flex-col space-y-2">
                                <a href="https://hiren.ninja" target="_blank" rel="noopener noreferrer" 
                                   class="text-blue-400 hover:text-blue-300">
                                    Hiren Budhrani
                                </a>
                            </div>
                            <div class="flex flex-col space-y-2">
                                <a href="https://stratessa.com/" target="_blank" rel="noopener noreferrer" 
                                   class="text-blue-400 hover:text-blue-300">
                                    Anna Veerman
                                </a>
                            </div>
                        </div>

                        <div class="border-t border-gray-700 pt-4">
                            <h4 class="text-lg font-semibold text-white mb-2">Learn More</h4>
                            <p>
                                Visit our blog when (under construction) to discover fascinating articles about lunar phenomena, astronomy, and the latest updates about Lunatrack.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
}>()

const close = () => {
    emit('close')
}
</script> 