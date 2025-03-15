<template>
    <div class="min-h-screen bg-black text-white">
        <!-- Fixed background -->
        <div class="fixed inset-0 bg-cover bg-center z-0"
            style="background-image: url('/images/starry-background.jpg');">
        </div>
        
        <div class="relative z-10">
            <AppHeader />
            <!-- Main content -->
            <main class="max-w-3xl mx-auto px-4 flex flex-col items-center pt-14">
                <slot />
            </main>
        </div>
    </div>
</template>

<style>
html,
body {
    background-color: black;
    min-height: 100vh;
    overflow-x: hidden; /* Prevent horizontal scrolling */
}

body {
    color: white;
}
</style>