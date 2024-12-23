<template>
    <div class="min-h-screen bg-gradient-to-b from-black via-purple-900 to-blue-900">
        <header class="py-4 px-6 bg-black/30 backdrop-blur-sm">
            <nav class="max-w-7xl mx-auto flex items-center justify-between">
                <NuxtLink to="/" class="text-white text-2xl font-bold">Moon Phase 🌙</NuxtLink>
                <div class="flex items-center space-x-6">
                    <NuxtLink to="/calendar" class="text-white hover:text-gray-300">Calendar</NuxtLink>
                    <NuxtLink to="/about" class="text-white hover:text-gray-300">About</NuxtLink>
                </div>
            </nav>
        </header>

        <!-- Star background with animation -->
        <div class="fixed inset-0 pointer-events-none">
            <div
                class="absolute inset-0 bg-[radial-gradient(white,_rgba(255,255,255,.2)_2px,_transparent_40px)] bg-[length:50px_50px]">
            </div>
        </div>

        <main class="relative z-10">
            <slot />
        </main>
    </div>
</template>