<!-- components/AppHeader.vue -->
<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex items-center justify-between h-14">
                <!-- Logo -->
                <NuxtLink to="/" class="font-audiowide text-3xl text-white">
                    LUNATRACK
                </NuxtLink>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center gap-3.5">
                    <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path"
                        class="text-white text-3xl font-helvetica hover:opacity-80 transition-opacity">
                        {{ item.label }}
                    </NuxtLink>
                </nav>

                <!-- Mobile Menu Button -->
                <button class="md:hidden p-2" @click="isOpen = !isOpen">
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
            <nav :class="['md:hidden transition-all overflow-hidden',
                isOpen ? 'max-h-96 pb-4' : 'max-h-0']">
                <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path"
                    class="block py-2 text-white text-xl font-helvetica hover:opacity-80" @click="isOpen = false">
                    {{ item.label }}
                </NuxtLink>
            </nav>
        </div>
    </header>
</template>

<script setup>
const isOpen = ref(false)

const menuItems = [
    { label: 'Blog', path: '/blog' }
]
</script>