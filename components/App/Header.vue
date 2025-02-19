<!-- components/AppHeader.vue -->
<template>
    <header class="fixed top-0 left-0 right-0 z-40 bg-neutral-900/80 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex items-center justify-between h-14">
                <!-- Logo -->
                <NuxtLink to="/" class="font-audiowide text-3xl text-white">
                    LUNATRACK
                </NuxtLink>

                <!-- Desktop Navigation -->
                <nav v-if="menuItems" class="hidden md:flex items-center gap-3.5">
                    <button v-for="item in menuItems" :key="item.path"
                        @click="item.action ? item.action() : navigateTo(item.path)"
                        class="text-white text-lg font-helvetica hover:opacity-80 transition-opacity"
                        :data-umami-event="item.label">
                        {{ item.label }}
                    </button>
                </nav>

                <!-- Mobile Menu Button -->
                <button v-if="menuItems" class="md:hidden p-2" @click="isOpen = !isOpen">
                    <div class="w-6 h-5 relative flex flex-col justify-between">
                        <span :class="['h-0.5 w-full bg-white transition-all',
                            isOpen ? 'rotate-45 translate-y-2' : '']"></span>
                        <span :class="['h-0.5 w-full bg-white transition-opacity',
                            isOpen ? 'opacity-0' : '']"></span>
                        <span :class="['h-0.5 w-full bg-white transition-all',
                            isOpen ? '-rotate-45 -translate-y-2' : '']"></span>
                    </div>
                </button>
            </div>

            <!-- Mobile Navigation -->
            <nav v-if="menuItems" :class="['md:hidden transition-all overflow-hidden',
                isOpen ? 'max-h-96 pb-4' : 'max-h-0']">
                <button v-for="item in menuItems" :key="item.path"
                    @click="item.action ? item.action() : navigateTo(item.path)"
                    class="block w-full py-2 text-white text-xl font-helvetica hover:opacity-80"
                    :data-umami-event="item.label">
                    {{ item.label }}
                </button>
            </nav>
        </div>

        <!-- About Modal -->
        <ModalsAboutModal 
            :is-open="isAboutModalOpen"
            @close="isAboutModalOpen = false"
        />
    </header>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const isOpen = ref(false)
const isAboutModalOpen = ref(false)

// Define menu items with actions
const menuItems = [
    { label: 'About', path: '#about', action: () => isAboutModalOpen.value = true },
    // { label: 'Features', path: '/features', action: () => navigateTo('/features') },
    // { label: 'Contact', path: '/contact', action: () => navigateTo('/contact') },
    // Add more menu items as needed
]

// Check for the anchor in the URL on component mount
onMounted(() => {
    if (window.location.hash === '#about') {
        isAboutModalOpen.value = true
        // Optionally, you can scroll to the top of the page
        window.scrollTo(0, 0)
    }
})
</script>