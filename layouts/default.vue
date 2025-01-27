<template>
    <div class="min-h-screen bg-cover bg-center bg-fixed text-white"
        style="background-image: url('/images/starry-background.jpg');">
        <AppHeader />
        <!-- Main content -->
        <main class="relative z-10 max-w-3xl mx-auto px-4 flex flex-col items-center pt-14">
            <slot />
        </main>
    </div>
</template>

<style>
html,
body {
    background-color: black;
    min-height: 100vh;
}

body {
    background-size: cover;
    background-position: center;
    color: white;
}

.bg-fixed {
    background-attachment: fixed;
}
</style>