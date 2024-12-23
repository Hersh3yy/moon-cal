<template>
    <div class="min-h-screen bg-cover bg-center text-white" style="background-image: url('/images/starry-background.jpg');">
        <!-- Main content -->
        <main class="relative z-10 max-w-3xl mx-auto px-4 flex flex-col items-center">
            <slot />
        </main>
    </div>
</template>

<style>
html, body {
    background-color: black;
    min-height: 100vh;
}

body {
    background-size: cover; /* Ensure the background covers the entire area */
    background-position: center; /* Center the background image */
    color: white; /* Set default text color to white */
}
</style>