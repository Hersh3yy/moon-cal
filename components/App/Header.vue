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
                        class="text-white text-lg font-helvetica hover:opacity-80 transition-opacity">
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
                    class="block w-full py-2 text-white text-xl font-helvetica hover:opacity-80">
                    {{ item.label }}
                </button>
            </nav>
        </div>
    </header>

    <!-- About Modal -->
    <ModalsAboutModal 
        :is-open="isAboutModalOpen"
        @close="isAboutModalOpen = false"
    />
</template>

<script setup>
const isOpen = ref(false)
const isAboutModalOpen = ref(false)

const menuItems = [
    { label: 'About', path: '#', action: () => isAboutModalOpen.value = true }
]
</script>